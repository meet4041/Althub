const express = require("express");
const institute_route = express();
const bodyParser = require("body-parser");
institute_route.use(bodyParser.json());
institute_route.use(bodyParser.urlencoded({ extended: true }));
const multer = require("multer");
const path = require('path');
institute_route.use(express.static('public'));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/instituteImages'), function (error, sucess) {
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
const institute_controller = require("../controllers/instituteController");

institute_route.post('/registerInstitute', institute_controller.registerInstitute);
institute_route.post('/instituteLogin', institute_controller.instituteLogin);
institute_route.post('/instituteUpdatePassword', institute_controller.instituteUpdatePassword);
institute_route.post('/instituteForgetPassword', institute_controller.instituteForgetPassword);
institute_route.post('/instituteResetPassword', institute_controller.instituteResetPassword);
institute_route.post('/instituteUpdate', institute_controller.updateInstitute);
institute_route.delete('/deleteInstitute/:id', institute_controller.deleteInstitute);
institute_route.get('/getInstitutes', institute_controller.getInstitues);
institute_route.get('/getInstituteById/:_id', institute_controller.searchInstituteById);
institute_route.post('/inviteUser', institute_controller.inviteUser);
institute_route.post('/uploadInstituteImage', upload.single('image'), institute_controller.uploadInstituteImage);

module.exports = institute_route;