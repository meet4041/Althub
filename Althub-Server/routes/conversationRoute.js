const express = require("express");
const conversation_route = express();
const bodyParser = require("body-parser");

conversation_route.use(bodyParser.json());
conversation_route.use(bodyParser.urlencoded({ extended: true }));
conversation_route.use(express.static('public'));

const conversation_controller = require("../controllers/conversationController");

//conversation routes
conversation_route.post('/newConversation', conversation_controller.newConversation);
conversation_route.get('/getConversations/:userId', conversation_controller.getConversation);
conversation_route.post('/searchConversations', conversation_controller.searchConversation);

module.exports = conversation_route;