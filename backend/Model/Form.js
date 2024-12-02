const mongoose = require('mongoose');

// Define the schema for each individual page/element in the form
const formFieldSchema = new mongoose.Schema({
    type: { // Type of field, e.g., "text", "multipleChoice", "radioButton", etc.
        type: String,
        required: true,
    },
    title: {
        type: String,
        trim: true,
        default: "...",
    },
    description: {
        default: "...",
        type: String,
        trim: true,
    },
    options: {  // Options only relevant for fields like "multipleChoice" or "radioButton"
        type: [String], 
        default: []
    },
    isRequired: {
        type: Boolean,
        default: false
    },
    placeholder: {
        type: String,
        trim: true
    },
    validation: { // Validation rules if needed, for example regex for email or number
        type: String,
        trim: true
    },
    order: {
        type: Number, // To maintain the order of pages/fields in the form
        
    },
    
}, {
    timestamps: true
});

// Define the form schema
const formSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        default: 'My new form',
        required: true
    },
    description: {
        type: String,
        trim: true,
    },
    pages: {
        type: [formFieldSchema], // Array of fields (or "pages")
        default: []
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    welcomePage: {
        type: String, // Title of the welcome page
        default: 'Welcome to the Form'
    },
    endingPage: {
        type: String, // Title of the ending page
        default: 'Thank you for completing the form!'
    },
    published: {
        type: String,
        default: "Not published"
    },
    uuid: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});

// Create the Form model
const Form = mongoose.model('Form', formSchema);

module.exports = Form;
