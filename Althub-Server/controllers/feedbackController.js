const Feedback = require("../models/feedbackModel");

//Add feedback
const addFeedback = async (req, res) => {
    try {
        const feedback = new Feedback({
            userid: req.body.userid,
            message: req.body.message,
            rate: req.body.rate
        });
        const feedback_data = await feedback.save();
        res.status(200).send({ success: true, data: feedback_data });
    } catch (error) {
        res.status(400).send({ success: false, msg: "Error in add feedback" });
    }
}

//view feedback
const getFeedback = async (req, res) => {
    try {
        const feedback_data = await Feedback.find({});
        res.status(200).send({ success: true, data: feedback_data });
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
}

//delete feedback
const deleteFeedback = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await Feedback.deleteOne({ _id: id });
        res.status(200).send({ success: true, msg: 'feedback Deleted successfully' });
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
}

module.exports = {
    addFeedback,
    getFeedback,
    deleteFeedback
}