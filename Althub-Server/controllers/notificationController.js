const Notification = require("../models/notificationModel");

//image upload
const uploadNotificationSenderImage = async (req, res) => {
    try {
        if (req.file !== undefined) {
            const picture = ({
                url: '/notificationSenderImages/' + req.file.filename,
            });
            res.status(200).send({ success: true, data: picture });
        }
        else {
            res.status(200).send({ success: false, msg: "plz select a file" });
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

//Add notification
const addNotification = async (req, res) => {
    try {
        const notification = new Notification({
            userid: req.body.userid,
            msg: req.body.msg,
            image: req.body.image,
            title:req.body.title,
            date:req.body.date,
        });
        const notification_data = await notification.save();
        res.status(200).send({ success: true, data: notification_data });
    } catch (error) {
        res.status(400).send({ success: false, msg: "Error in Add notification" });
    }
}

//view all notification
const getnotifications = async (req, res) => {
    try {
        const notification_data = await Notification.find({ userid: req.body.userid }).limit(5);
        res.status(200).send({ success: true, data: notification_data });
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
}

module.exports = {
    uploadNotificationSenderImage,
    addNotification,
    getnotifications
}