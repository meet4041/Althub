const express = require("express");
const education_route = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { requireAuth } = require("../middleware/authMiddleware");
education_route.use(bodyParser.json());
education_route.use(bodyParser.urlencoded({ extended: true }));
education_route.use(cookieParser());
education_route.use(express.static('public'));
const multer = require("multer");
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/educationImages'), function (error, sucess) {
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
const education_controller = require("../controllers/educationController");

//Education routes
education_route.post('/addEducation', education_controller.addEducation);
education_route.post('/getEducation', education_controller.getEducation);
education_route.delete('/deleteEducation/:id', education_controller.deleteEducation);
education_route.post('/editEducation', education_controller.editEducation);
education_route.post('/uploadCollageLogo', upload.single('collagelogo'), education_controller.uploadEducationImage);

module.exports = education_route;