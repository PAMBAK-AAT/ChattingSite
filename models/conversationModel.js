const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    text: {
        type: String,
        default: ""
    },
    imageUrl: {
        type: String,
        default: ""
    },
    videoUrl: {
        type: String,
        default: ""
    },
    seen: {
        type: Boolean,
        default: false,
    },
    msgByUserId : {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: "User"
    }
    
}, {
    timestamps: true
});

const conversationSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: "User"
    },
    receiver: { // Corrected from 'reciever' to 'receiver'
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: "User"
    },
    messages: [{
        type: mongoose.Schema.ObjectId,
        ref: "Messages",
    }]
}, {
    timestamps: true,
});

const MessageModel = mongoose.model("Messages", messageSchema); // Corrected here
const ConversationModel = mongoose.model("Conversations", conversationSchema); // Corrected here

module.exports = {
    ConversationModel,
    MessageModel
};







