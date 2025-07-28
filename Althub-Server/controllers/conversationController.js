const Conversation = require("../models/conversationModel");

//new conversation
const newConversation = async (req, res) => {
    const newconversation = new Conversation({
        members: [req.body.senderId, req.body.receiverId]
    });
    try {
        const savedConversation = await newconversation.save();
        res.status(200).send({ success: true, data: savedConversation });
    } catch (error) {
        res.status(500).send({ success: false, msg: error.message });
    }
};

//get conversation of a user
const getConversation = async (req, res) => {
    try {
        const conversation = await Conversation.find({
            members: { $in: [req.params.userId] }
        });
        res.status(200).send({ success: true, data: conversation });
    } catch (error) {
        res.status(500).send({ success: false, msg: error.message });
    }
}

// Search Conversation
const searchConversation = async (req, res) => {
    try {
        const conversation = await Conversation.find({
            members: { $all: [req.body.person1 ,req.body.person2] }
        });
        res.status(200).send({ success: true, data: conversation });
    } catch (error) {
        res.status(500).send({ success: false, msg: error.message });
    }
}

module.exports = {
    newConversation,
    getConversation,
    searchConversation
}