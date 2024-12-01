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
const { default: mongoose } = require('mongoose');



// Middleware
const app = express();
app.use(cors());

app.use(express.json()); // To parse json bodies

connectMongoDB(mongoDbUri);

app.post("/signup", async (req, res) => {
    const { username, email, password } = req.body;
    console.log("username: ", username);
    console.log("password: ", password);
    console.log("email: ", email);

    try {
        // Check if email already in use
        const [existingEmail, existingUsername] = await Promise.all([
            User.findOne({ email }),
            User.findOne({ username })
        ]); if (existingEmail) {
            return res.status(400).json({
                message: "Email already in use"
            })
        }

        // Check if the username already exist
        if (existingUsername) {
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

    } catch (error) {
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

    try {
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(400).json({
                message: "Email  is incorrect"
            });
        }
        if (existingUser.password !== password) {
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


    } catch (error) {
        console.log("Error durng Login");
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
})


app.get("/form/:formId", async (req, res) => {
    const { formId } = req.params;
    console.log("This is the formId from frontend: ", formId);
    try {
        const form = await Form.findById(formId);
        if (!form) {
            return res.status(404).json({
                message: "Form not found"
            })
        }
        res.status(200).json(form);
    }
    catch (error) {
        console.log("Error while fetching specific form: ", error);
    }
})

app.put("/updateform/:formId", async (req, res) => {
    try {
        const { formId, } = req.params;
        const updatedForm = req.body;
        console.log("Form from frontend: ", updatedForm);
        console.log(formId);
        if(!formId ){
            return res.status(405).json({ message: "Required formId"});
        }
        if(!updatedForm) return res.status(405).json({ message: "Required updatedForm"});

        // const { title, description, pages } = req.body;
        const resultForm = await Form.findByIdAndUpdate(formId,
            updatedForm,
            { new: true }
        );
        console.log("This is the result from mongodb", resultForm);

        if (!resultForm) {
            return res.status(400).json({
                message: "Form not found"
            })
        }
        res.status(200).json({
            message: "Form UpdatedSuccesfully",
            resultForm
        })
    } catch (error) {
        console.log("There was an error while updating form: ", error);
        res.status(500).json({
            message: "There was an error while updating form"
        })
    }
})

app.post("/createForm", authMiddleware, async (req, res) => {

    const { username, email } = req.user;
    const { title, description, fields } = req.body;
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

app.put('/forms/:formId', async (req, res) => {
    const { formId } = req.params;
    const { title, description } = req.body;
    console.log(title, description);

    try {
        const updatedForm = await Form.findByIdAndUpdate(
            formId,
            { title, description },
            { new: true } // Return the updated form
        );

        if (!updatedForm) {
            return res.status(404).json({ message: "Form not found" });
        }

        res.json(updatedForm); // Send the updated form back in the response
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

app.post("/createNewForm", authMiddleware, async (req, res) => {
    try {
        const { username, } = req.user;
        console.log("username: ", username);
        // console.log("password: ", password);
        const defaultForm = {
            title: "My new form",
            description: "This is a starter form that can be customized",
            welcome: "Welcome to default form",
            endingPage: "Thanks for completing the form",
            pages: [
                {
                    type: "text",
                    title: "What is your name?",
                    description: "Enter your full name",
                    order: 1,
                    isRequired: true,
                    placeholder: "Enter your name"
                },
                {
                    type: "Multiple Choice question",
                    title: "How satisfied are you?",
                    description: "How was our service",
                    options: ["very satisfied", "satisfied", "neutral", "dissatisfied"],
                    order: 2,
                    isRequired: true
                },
                {
                    type: 'radioButton',
                    description: "Choose from this",
                    title: 'Would you recommend this service?',
                    options: ['Yes', 'No'],
                    order: 3,
                    isRequired: true,
                },
            ],
            createdBy: new mongoose.Types.ObjectId(),
        }

        const newForm = new Form(defaultForm);
        console.log("This is the new form: ", newForm);
        const savedForm = await newForm.save();
        res.status(201).json(savedForm);


    } catch (error) {
        console.log("There was an error creating a new form: ", error);
        res.status(500).json({
            message: "Error creating default form"
        })
    }
})


app.get("/getAllForms", async (req, res) => {
    try {
        const forms = await Form.find();
        res.status(200).json(forms);

    } catch (error) {
        console.log("There was an error while fetching all forms from database: ", error);
        res.status(500).json({
            message: "There was an error while fetching all the forms from the database"
        })
    }
})



app.listen(PORT, console.log(`App running on PORT: ${PORT}`));
