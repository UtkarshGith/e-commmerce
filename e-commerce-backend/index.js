const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const { ObjectId } = require('mongodb');

const app = express();
const port = 4000;

app.use(express.json());
app.use(cors());

// Database connection function
async function connectDB() {
    try {
        const username = 'your_mongodb_username'; // replace with your MongoDB username
        const password = 'your_mongodb_password'; // replace with your MongoDB password
        const uri = `mongodb://${username}:${password}@cluster0-shard-00-00.hjbcp.mongodb.net:27017,cluster0-shard-00-01.hjbcp.mongodb.net:27017,cluster0-shard-00-02.hjbcp.mongodb.net:27017/?ssl=true&replicaSet=atlas-jlbx1u-shard-0&authSource=admin&retryWrites=true&w=majority`;
        
        await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('MongoDB connection successful');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1); // Exit the process if connection fails
    }
}

// Call the connectDB function to establish the connection
connectDB();

// Image Storage Engine
const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage: storage });
app.use('/images', express.static('upload/images'));

// API Creation
app.get('/', (req, res) => {
    res.send("Express App is running");
});

// Creating upload Endpoint
app.post("/upload", upload.single('product'), (req, res) => {
    console.log(req.file.filename);
    res.json({
        success: 1,
        image_url: `http://localhost:${port}/images/${req.file.filename}`
    });
});

// MongoDB Collections
let collection, usercollection;
const productSchema = new mongoose.Schema({ /* Define your product schema here */ });
const userSchema = new mongoose.Schema({ /* Define your user schema here */ });

const Product = mongoose.model('Product', productSchema);
const User = mongoose.model('User', userSchema);

// Endpoint for adding products
app.post("/addproduct", async (req, res) => {
    try {
        let productId = req.body.id;

        if (!productId) {
            const lastProduct = await Product.find().sort({ id: -1 }).limit(1);
            productId = lastProduct.length > 0 ? lastProduct[0].id + 1 : 1;
        }

        const product = {
            id: productId,
            name: req.body.name,
            image: req.body.image,
            category: req.body.category,
            new_price: req.body.new_price,
            old_price: req.body.old_price,
            date: new Date(),
            available: true,
        };

        await Product.create(product);
        console.log("Product saved:", product);
        res.json({ success: true, name: req.body.name, id: productId });
    } catch (error) {
        console.error("Error saving product:", error);
        res.status(500).json({ success: false, message: "Error adding product" });
    }
});

// Endpoint for removing product
app.post("/removeProduct", async (req, res) => {
    const productId = req.body.id;
    if (!productId) {
        return res.status(400).json({ success: false, message: "Product id is required " });
    }
    const result = await Product.deleteOne({ id: productId });
    if (result.deletedCount == 1) {
        res.json({ success: true, message: `Product with id ${productId} removed` });
    } else {
        console.log(`No product found with id ${productId}`);
        res.status(404).json({ success: false, message: "Product not found" });
    }
});

// Endpoint to get all products
app.get("/allproducts", async (req, res) => {
    const allProducts = await Product.find();
    console.log("All Products Fetched");
    res.send(allProducts);
});

// User Signup Endpoint
app.post('/signup', async (req, res) => {
    try {
        const { username: name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User with this email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        let cart = {};
        for (let i = 0; i < 300; i++) {
            cart[i] = 0;
        }

        const newUser = {
            name,
            email,
            password: hashedPassword,
            cartData: cart,
            date: new Date(),
        };

        await User.create(newUser);
        const data = { user: { id: newUser._id } };
        const token = jwt.sign(data, 'secret_ecom');
        res.json({ success: true, token });
    } catch (error) {
        console.error("Error during user signup:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// Creating endpoint for user login
app.post('/login', async (req, res) => {
    try {
        let user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid email address" });
        }

        const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ success: false, message: "Incorrect password" });
        }

        const data = { user: { id: user._id } };
        const token = jwt.sign(data, 'secret_ecom', { expiresIn: '1h' });

        res.json({ success: true, token });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// Middleware to fetch user
const fetchUser = async (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) {
        return res.status(401).send({ errors: "Please authenticate using a valid token" });
    }

    try {
        const data = jwt.verify(token, 'secret_ecom');
        req.user = data.user;
        next();
    } catch (error) {
        console.error('JWT verification error:', error);
        return res.status(401).send({ errors: "Please authenticate using a valid token" });
    }
};

// Fetch user cart data
app.post('/getcart', fetchUser, async (req, res) => {
    try {
        const userId = new ObjectId(req.user.id);
        let userdata = await User.findById(userId);

        if (!userdata) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.json(userdata.cartData);
    } catch (error) {
        console.error("Error fetching user cart:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// Start the server after the database connection is established
app.listen(port, '0.0.0.0', (error) => {
    if (!error) {
        console.log("Server Running On port " + port);
    } else {
        console.log("Error" + error);
    }
});
