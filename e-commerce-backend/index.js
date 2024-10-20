const express = require("express");
const { MongoClient } = require("mongodb");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const { ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 4000; // Use the environment port or default to 4000

// Middleware
app.use(express.json());
app.use(cors());

// Database connection URL and client configuration
const uri = "mongodb+srv://singhutkarsh140603:Ram%401234@cluster0.mongodb.net/e-commerce-backend?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Initialize variables for the database and collections
let db;
let collection, userCollection;

// Database connection function
async function connectDB() {
    try {
        await client.connect();
        console.log("Connected to MongoDB successfully");

        // Set the database and collections
        db = client.db("e-commerce-backend");
        collection = db.collection("Product");
        userCollection = db.collection("user");
    } catch (err) {
        console.error("MongoDB connection error:", err);
        process.exit(1); // Exit the process if connection fails
    }
}

// Call the connectDB function to establish the connection
connectDB();

// API Creation
app.get("/", (req, res) => {
    res.send("Express App is running");
});

// Image Storage Engine
const storage = multer.diskStorage({
    destination: "./upload/images",
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    },
});

const upload = multer({ storage: storage });
app.use("/images", express.static("upload/images"));

// Creating upload Endpoint
app.post("/upload", upload.single("product"), (req, res) => {
    console.log(req.file.filename);
    res.json({
        success: 1,
        image_url: `http://localhost:${port}/images/${req.file.filename}`,
    });
});

// Endpoint for adding products
app.post("/addproduct", async (req, res) => {
    try {
        let productId = req.body.id;

        // If the id is not provided, find the highest id in the collection and increment it
        if (!productId) {
            const lastProduct = await collection.find().sort({ id: -1 }).limit(1).toArray();
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

        await collection.insertOne(product);
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

// API for removing product
app.post("/removeProduct", async (req, res) => {
    const productId = req.body.id;
    if (!productId) {
        return res.status(400).json({
            success: false,
            message: "Product id is required",
        });
    }
    const result = await collection.deleteOne({ id: productId });
    if (result.deletedCount === 1) {
        res.json({ success: true, message: `Product with id ${productId} removed` });
    } else {
        console.log(`No product found with id ${productId}`);
        res.status(404).json({ success: false, message: "Product not found" });
    }
});

// Endpoint to get all products
app.get("/allproducts", async (req, res) => {
    try {
        const allProducts = await collection.find().toArray();
        console.log("All Products Fetched");
        res.json(allProducts);
    } catch (error) {
        console.error("Error fetching all products:", error);
        res.status(500).json({ success: false, message: "Error fetching products" });
    }
});

// User Signup Endpoint
app.post("/signup", async (req, res) => {
    try {
        const { username: name, email, password } = req.body;

        // Check if the user already exists
        const existingUser = await userCollection.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User with this email already exists",
            });
        }

        // Hash the password before storing
        const hashedPassword = await bcrypt.hash(password, 10);

        // Initialize cart data
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

        await userCollection.insertOne(newUser);

        const data = {
            user: {
                id: newUser._id,
            },
        };
        const token = jwt.sign(data, "secret_ecom");

        res.json({
            success: true,
            token,
        });
    } catch (error) {
        console.error("Error during user signup:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
});

// Endpoint for user login
app.post("/login", async (req, res) => {
    try {
        const user = await userCollection.findOne({ email: req.body.email });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid email address",
            });
        }

        const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);

        if (!isPasswordMatch) {
            return res.status(400).json({
                success: false,
                message: "Incorrect password",
            });
        }

        const data = {
            user: {
                id: user._id,
            },
        };
        const token = jwt.sign(data, "secret_ecom", { expiresIn: "1h" });

        res.json({
            success: true,
            token,
        });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
});

// Middleware to fetch user
const fetchUser = async (req, res, next) => {
    const token = req.header("auth-token");

    if (!token) {
        return res.status(401).send({ errors: "Please authenticate using a valid token" });
    }

    try {
        const data = jwt.verify(token, "secret_ecom");
        req.user = data.user;
        next();
    } catch (error) {
        console.error("JWT verification error:", error);
        return res.status(401).send({ errors: "Please authenticate using a valid token" });
    }
};

// Fetch user cart data
app.post("/getcart", fetchUser, async (req, res) => {
    try {
        const userId = new ObjectId(req.user.id);
        let userData = await userCollection.findOne({ _id: userId });

        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.json(userData.cartData);
    } catch (error) {
        console.error("Error fetching user cart:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// Start the server after the database connection is established
app.listen(port, "0.0.0.0", (error) => { // Listen on 0.0.0.0 for external access
    if (!error) {
        console.log("Server Running On port " + port);
    } else {
        console.log("Error" + error);
    }
});
