const port = 4000;
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const { ObjectId } = require('mongodb');

app.use(express.json());
app.use(cors());

// Remote MongoDB connection function using Mongoose
async function connectDB() {
    try {
        const username = encodeURIComponent('singhutkarsh140603');  // Encode special characters in the username
        const password = encodeURIComponent('Ram%401234');  // Encode special characters in the password

        const uri = `mongodb://${username}:${password}@cluster0-shard-00-00.hjbcp.mongodb.net:27017,cluster0-shard-00-01.hjbcp.mongodb.net:27017,cluster0-shard-00-02.hjbcp.mongodb.net:27017/?ssl=true&replicaSet=atlas-jlbx1u-shard-0&authSource=admin&retryWrites=true&w=majority`;

        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            appName: 'Cluster0/e-comm',
        });

        console.log('MongoDB connection successful');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1); // Exit the process if connection fails
    }
}

connectDB();

// Define your MongoDB collections using Mongoose schemas
const productSchema = new mongoose.Schema({
    id: Number,
    name: String,
    image: String,
    category: String,
    new_price: Number,
    old_price: Number,
    date: { type: Date, default: Date.now },
    available: Boolean,
});

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    cartData: Object,
    date: { type: Date, default: Date.now },
});

const Product = mongoose.model('Product', productSchema);
const User = mongoose.model('User', userSchema);

// API Creation
app.get('/', (req, res) => {
    res.send("Express App is running");
});

// Image Storage Engine
const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage: storage });
app.use('/images', express.static('upload/images'));

// API for uploading images
app.post("/upload", upload.single('product'), (req, res) => {
    console.log(req.file.filename);
    res.json({
        success: 1,
        image_url: `http://localhost:${port}/images/${req.file.filename}`
    });
});

// Endpoint for adding products
app.post("/addproduct", async (req, res) => {
    try {
        let productId = req.body.id;

        // If no id is provided, find the highest id in the collection and increment it
        if (!productId) {
            const lastProduct = await Product.find().sort({ id: -1 }).limit(1);

            if (lastProduct.length > 0) {
                productId = lastProduct[0].id + 1;
            } else {
                productId = 1;
            }
        }

        // Create and save the new product
        const product = new Product({
            id: productId,
            name: req.body.name,
            image: req.body.image,
            category: req.body.category,
            new_price: req.body.new_price,
            old_price: req.body.old_price,
            available: true,
        });

        await product.save();
        console.log("Product saved:", product);

        res.json({
            success: true,
            name: req.body.name,
            id: productId,
        });
    } catch (error) {
        console.error("Error saving product:", error);
        res.status(500).json({ success: false, message: "Error adding product" });
    }
});

// API for removing products
app.post("/removeProduct", async (req, res) => {
    const productId = req.body.id;
    if (!productId) {
        return res.status(400).json({ success: false, message: "Product id is required" });
    }

    const result = await Product.deleteOne({ id: productId });
    if (result.deletedCount === 1) {
        res.json({ success: true, message: `Product with id ${productId} removed` });
    } else {
        res.status(404).json({ success: false, message: "Product not found" });
    }
});

// Get all products
app.get("/allproducts", async (req, res) => {
    const allProducts = await Product.find();
    console.log("All Products Fetched");
    res.send(allProducts);
});

// API for user signup
app.post('/signup', async (req, res) => {
    try {
        const { username: name, email, password } = req.body;

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User with this email already exists",
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Initialize cart data
        let cart = {};
        for (let i = 0; i < 300; i++) {
            cart[i] = 0;
        }

        // Save new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            cartData: cart,
        });

        await newUser.save();

        // Generate JWT token
        const token = jwt.sign({ id: newUser._id }, 'secret_ecom', { expiresIn: '1h' });

        res.json({ success: true, token });
    } catch (error) {
        console.error("Error during user signup:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// API for user login
app.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid email address" });
        }

        // Check the password
        const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ success: false, message: "Incorrect password" });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, 'secret_ecom', { expiresIn: '1h' });
        res.json({ success: true, token });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// API to fetch new collections
app.get('/newcollections', async (req, res) => {
    const products = await Product.find();
    const newCollections = products.slice(-8);
    console.log("New collections fetched");
    res.send(newCollections);
});

// API to fetch popular products in women's category
app.get('/popularinwomen', async (req, res) => {
    const products = await Product.find({ category: "women" });
    const popularInWomen = products.slice(0, 4);
    console.log("Popular products in women category fetched");
    res.send(popularInWomen);
});

// Middleware to authenticate user via token
const fetchUser = async (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) {
        return res.status(401).send({ errors: "Please authenticate using a valid token" });
    }

    try {
        const data = jwt.verify(token, 'secret_ecom');
        req.user = data;
        next();
    } catch (error) {
        return res.status(401).send({ errors: "Token is not valid" });
    }
};

// API to add items to cart
app.post('/addtocart', fetchUser, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const itemId = req.body.ItemId;

        // Update cart data
        user.cartData[itemId] = (user.cartData[itemId] || 0) + 1;
        await user.save();

        res.send("Added to cart");
    } catch (error) {
        console.error("Error adding to cart:", error);
        res.status(500).send({ error: "Internal Server Error" });
    }
});

// API to get user cart data
app.post('/getcart', fetchUser, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.json(user.cartData);
    } catch (error) {
        console.error("Error fetching user cart:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// Start the server
app.listen(port, (error) => {
    if (error) {
        console.error("Error starting server:", error);
    } else {
        console.log(`Server is running on port ${port}`);
    }
});
