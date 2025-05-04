const express = require("express");
const experience_route = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
experience_route.use(bodyParser.json());
experience_route.use(bodyParser.urlencoded({ extended: true }));
const multer = require("multer");
const path = require('path');
experience_route.use(express.static('public'));
experience_route.use(cookieParser());

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/experienceImages'), function (error, sucess) {
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
const experience_controller = require("../controllers/experienceController");

//Education routes
experience_route.post('/addExperience', experience_controller.addExperience);
experience_route.post('/getExperience', experience_controller.getExperience);
experience_route.delete('/deleteExperience/:id', experience_controller.deleteExperience);
experience_route.post('/editExperience', experience_controller.editExperience);
experience_route.post('/uploadCompanyLogo', upload.single('companylogo'), experience_controller.uploadExperienceImage);

module.exports = experience_route;