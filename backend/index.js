const express = require('express');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const connectMongoDB = require('./connection.js');
const User = require('./Model/User.js');
const PORT = process.env.PORT || 3000;
const mongoDbUri = process.env.MONGODB_URI;
const Form = require('./Model/Form');



// Middleware
const app = express();
app.use(express.json()); // To parse json bodies

connectMongoDB(mongoDbUri);

app.post("/signup", async(req, res) => {
    const {username, email, password} = req.body;

    try{
        // Check if email already in use
        const [existingEmail, existingUsername] = await Promise.all([
            User.findOne({ email }),
            User.findOne({ username })
        ]);        if(existingEmail){
            return res.status(400).json({
                message: "Email already in use"
            })
        }

        // Check if the username already exist
        if(existingUsername){
            return res.status(400).json({
                message: "Username already in use"
            })
        }


        // Create new User
        const newUser = new User({
            email: email,
            username: username,
            password: password
        })
        await newUser.save();
        res.status(201).json({
            message: "User create successfully"
        })
        
    }catch(error){
        console.log("Error during signup", error);
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
})


app.post("/createForm", async(req, res) => {
    const {title, description, fields, createdBy} = req.body;
    console.log("This is req.body from /createForm", req.body);

    const user = await User.findOne({ username: createdBy });
    console.log("This is the user from /createForm", user);
    if(!user){
        return res.status(400).json({
            message: "No user found"
        })
    }
    const newForm = new Form({
        title,
        description,
        fields,
        createdBy: user._id
    })
    await newForm.save();
    res.status(201).json({
        message: "Form created successfully"
    })

})



app.listen(PORT, console.log(`App running on PORT: ${PORT}`));
