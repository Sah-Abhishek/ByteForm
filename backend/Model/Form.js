const  mongoose  = require("mongoose");

const formSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        default: 'My new form',
        require: true
    },
    description: {
        type: String,
        trim: true,
    },
    fields: {
        type: mongoose.Schema.Types.Mixed,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
},{
    timestamps: true
})

const Form = mongoose.model('Form', formSchema);

module.exports = Form;