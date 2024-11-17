const express = require('express');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const connectMongoDB = require('./connection.js');
const User = require('./Model/User.js');
const PORT = process.env.PORT || 3000;
const mongoDbUri = process.env.MONGODB_URI;
const Form = require('./Model/Form');
const jwtSecret = process.env.JWT_SECRET;
const authMiddleware = require('./middleware/authMIddleware.js')
const cors = require('cors');



// Middleware
const app = express();
app.use(cors());

app.use(express.json()); // To parse json bodies

connectMongoDB(mongoDbUri);

app.post("/signup", async(req, res) => {
    const {username, email, password} = req.body;
    console.log("username: ", username);
    console.log("password: ", password);
    console.log("email: ", email);

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
            message: "User created successfully"
        })
        
    }catch(error){
        console.log("Error during signup", error);
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
})

app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    console.log("email: ", email);
    console.log("password: ", password);

    try{
        const existingUser = await User.findOne({ email});
        if(!existingUser) {
            return res.status(400).json({
                message: "Email  is incorrect"
            });
        }
        if(existingUser.password !== password){
            return res.status(400).json({
                message: "password is incorrect"
            });
        }

        // Generate token after successfull authentication

        const token = jwt.sign({
            username: existingUser.username,
            email: existingUser.email
        }, jwtSecret);

        res.status(201).json({
            message: "Login Successfull",
            token,
            user: {
                email: existingUser.email,
                username: existingUser.username
            }
        })


    }catch(error){
        console.log("Error durng Login");
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
})


app.post("/createForm", authMiddleware, async(req, res) => {
    
    const { username, email } = req.user;
    const {title, description, fields} = req.body;
    console.log("This is req.user from /login ", req.user);
    console.log("This is req.body from /createForm", req.body);

    const user = await User.findOne({ username });
    console.log("This is the user from /createForm", user);
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
