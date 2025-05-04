const express = require("express");
const feedback_route = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

feedback_route.use(bodyParser.json());
feedback_route.use(bodyParser.urlencoded({ extended: true }));

feedback_route.use(cookieParser());
feedback_route.use(express.static('public'));

const feedback_controller = require("../controllers/feedbackController");

//feedback routes
feedback_route.post('/addFeedback', feedback_controller.addFeedback);
feedback_route.get('/getFeedback', feedback_controller.getFeedback);
feedback_route.delete('/deleteFeedback/:id', feedback_controller.deleteFeedback);

module.exports = feedback_route;