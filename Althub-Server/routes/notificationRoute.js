const express = require("express");
const notification_route = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { requireAuth } = require("../middleware/authMiddleware");
notification_route.use(bodyParser.json());
notification_route.use(bodyParser.urlencoded({ extended: true }));
notification_route.use(cookieParser());
notification_route.use(express.static('public'));
const multer = require("multer");
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/notificationSenderImages'), function (error, sucess) {
            if (error) throw error
        });
    },
    filename: function (req, file, cb) {
        const name = Date.now() + '-' + file.originalname;
        cb(null, name, function (error1, success1) {
            if (error1) throw error1
        })
    }
});

const upload = multer({ storage: storage });
const notification_controller = require("../controllers/notificationController");

//Company routes
notification_route.post('/addNotification', notification_controller.addNotification);
notification_route.post('/getnotifications', notification_controller.getnotifications);
notification_route.post('/uploadNotificationSenderImage', upload.single('senderimage'), notification_controller.uploadNotificationSenderImage);

module.exports = notification_route;