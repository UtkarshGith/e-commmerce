const port = 4000;
const express = require("express");
const app = express();
const { MongoClient } = require("mongodb");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const { ObjectId } = require('mongodb');

app.use(express.json());
app.use(cors());

// Database connection URL and client
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

// Initialize a variable for the database
let db;
let collection,usercollection;

// Database connection function
async function connectDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB successfully");

    // Set the database and collection
    db = client.db("e-commerce-backend");
    collection = db.collection("Product");
    usercollection=db.collection("user");

    // Perform any necessary setup here, such as indexes
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
}

// Call the connectDB function to establish the connection
connectDB();

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

// Creating upload Endpoint
app.use('/images', express.static('upload/images'));
app.post("/upload", upload.single('product'), (req, res) => {
  console.log(req.file.filename);
  res.json({
    success: 1,
    image_url: `http://localhost:${port}/images/${req.file.filename}`
    
  });
});

// Endpoint for adding products
// Endpoint for adding products
app.post("/addproduct", async (req, res) => {
    try {
      let productId = req.body.id;
  
      // If the id is not provided, find the highest id in the collection and increment it
      if (!productId) {
        const lastProduct = await collection
          .find()
          .sort({ id: -1 }) // Sort by id in descending order
          .limit(1)         // Get the highest id product
          .toArray();       // Convert the result to an array
  
        if (lastProduct.length > 0) {
          productId = lastProduct[0].id + 1; // Increment the highest id by 1
        } else {
          productId = 1; // If no products exist, start with id 1
        }
      }
  
      // Create the new product object
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
  
      // Insert product into the collection
      await collection.insertOne(product);
      console.log("Product saved:", product);
      
      res.json({
        success: true,
        name: req.body.name,
        id: productId, // Return the generated or provided id
      });
    } catch (error) {
      console.error("Error saving product:", error);
      res.status(500).json({ success: false, message: "Error adding product" });
    }
  });

   //Creating API for removing product in our database
  app.post("/removeProduct",async(req,res)=>{
    const productId=req.body.id;
    if(!productId)
    {
        return res.status(400).json({
          success:false,
          message:"Product id is required "
        });
    }
    const result=await collection.deleteOne({id:productId});
    if(result.deletedCount==1)
    {
        res.json({ success: true, message: `Product with id ${productId} removed` });
    }
    else{
        console.log(`No product found with id ${productId}`);
      res.status(404).json({ success: false, message: "Product not found" });
    }


  });

  //Endpoints to get all the product from so that based on this we can display on frontend
  app.get("/allproducts",async(req,res)=>{
    const allProducts=await collection.find().toArray();
    console.log("All Products Fetched");
    res.send(allProducts);

  });
 


  

// Start the server after the database connection is established
app.listen(port, (error) => {
  if (!error) {
    console.log("Server Running On port " + port);
  } else {
    console.log("Error" + error);
  }
});

// User Signup Endpoint
// User Signup Endpoint
app.post('/signup', async (req, res) => {
  try {
    const { username: name, email, password } = req.body; // Adjusted to handle 'username' from req.body
    console.log(req.body);

    // Check if the user already exists
    const existingUser = await usercollection.findOne({ email });
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

    // Insert new user into the collection
    const newUser = {
      name,  // 'name' now correctly assigned from 'username'
      email,
      password: hashedPassword, // Store the hashed password
      cartData: cart,
      date: new Date(),
    };

    await usercollection.insertOne(newUser);

    // Generate JWT token
    const data = {
      user: {
        id: newUser._id, // Use MongoDB generated _id
      },
    };
    const token = jwt.sign(data, 'secret_ecom');

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





// Creating endpoint for user login
app.post('/login', async (req, res) => {
  try {
    // Find the user by email
    let user = await usercollection.findOne({ email: req.body.email });
    
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email address" // Clearer message for email not found
      });
    }
    
    // Compare the entered password with the stored hashed password
    const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);
    
    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect password"
      });
    }

    // If email and password are correct, generate a JWT token
    const data = {
      user: {
        id: user._id  // It's a good practice to use MongoDB `_id` instead of `id`
      }
    };
    const token = jwt.sign(data, 'secret_ecom', { expiresIn: '1h' });  // Token expires in 1 hour

    // Return the token to the user
    res.json({
      success: true,
      token
    });
    
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

//creating endpoints for new collection data

app.get('/newcollections',async(req,res)=>{
  const products=await collection.find().toArray();
  let newcollections=products.slice(1).slice(-8);
  console.log("newcollections fetched");
  res.send(newcollections);
})


//creating an endpoints for popular in women category
app.get('/popularinwomen',async(req,res)=>{
  const products=await collection.find({category:"women"}).toArray();
  let popular_in_women=products.slice(0,4);
  console.log("popular_in_women fetched");
  res.send(popular_in_women);
})



//creating middleware to fetch user
const fetchUser = async (req, res, next) => {
  const token = req.header('auth-token');
  console.log('Received token:', token); // Log the received token

  if (!token) {
    return res.status(401).send({ errors: "Please authenticate using a valid token" });
  }

  try {
    const data = jwt.verify(token, 'secret_ecom'); // Verify the token
    req.user = data.user; // Attach the user data to the request object
    next(); // Call the next middleware or route handler
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      console.error('Token has expired:', error); // Log the expiration error
      return res.status(401).send({ errors: "Token has expired, please log in again" });
    }
    console.error('JWT verification error:', error); // Log any other JWT verification errors
    return res.status(401).send({ errors: "Please authenticate using a valid token" });
  }
};


//Fetch user cart data

app.post('/addtocart', fetchUser, async (req, res) => {
  console.log(req.body, req.user);

  try {
    // Convert user ID to ObjectId for the query
    const userId = new ObjectId(req.user.id); // Use 'new' here
    let userdata = await usercollection.findOne({ _id: userId });

    if (!userdata) {
      return res.status(404).send({ error: "User not found" });
    }

    // Ensure cartData is initialized
    if (!userdata.cartData) {
      userdata.cartData = {}; // Initialize if not present
    }

    // Increment the cart count
    const itemId = req.body.ItemId; // Use ItemId from request body
    userdata.cartData[itemId] = (userdata.cartData[itemId] || 0) + 1;

    // Update the cartData field in the database
    await usercollection.findOneAndUpdate(
      { _id: userId },
      { $set: { cartData: userdata.cartData } } // Use $set to update the cartData
    );

    res.send("Added");
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});



// Remove a product from the user's cart

app.post('/removefromcart', fetchUser, async (req, res) => {
  console.log(req.body, req.user);

  try {
    // Convert user ID to ObjectId for the query
    const userId = new ObjectId(req.user.id); // Use 'new' here
    let userdata = await usercollection.findOne({ _id: userId });

    if (!userdata) {
      return res.status(404).send({ error: "User not found" });
    }

    // Ensure cartData is initialized
    if (!userdata.cartData) {
      userdata.cartData = {}; // Initialize if not present
    }

    // Increment the cart count
    const itemId = req.body.ItemId; // Use ItemId from request body
    if( userdata.cartData[itemId]>0)
    {
    userdata.cartData[itemId] = (userdata.cartData[itemId] || 0) - 1;
    }

    // Update the cartData field in the database
    await usercollection.findOneAndUpdate(
      { _id: userId },
      { $set: { cartData: userdata.cartData } } // Use $set to update the cartData
    );

    res.send("Added");
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});


app.post('/getcart', fetchUser, async (req, res) => {
  try {
    // Convert req.user.id to ObjectId to query the MongoDB _id field
    const userId = new ObjectId(req.user.id); // Use 'new' here
    let userdata = await usercollection.findOne({ _id: userId });
  
    console.log(userdata);
    // Check if userdata exists before accessing cartData
    if (!userdata) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json(userdata.cartData);
  } catch (error) {
    console.error("Error fetching user cart:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

  
  



