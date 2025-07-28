const express = require("express");
const admin_route = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
admin_route.use(cookieParser());
admin_route.use(bodyParser.json());
admin_route.use(bodyParser.urlencoded({ extended: true }));
const multer = require("multer");
const path = require('path');
admin_route.use(express.static('public'));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/adminImages'), function (error, sucess) {
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
const admin_controller = require("../controllers/adminController");

//admin routes
admin_route.post('/registerAdmin', admin_controller.registerAdmin);
admin_route.post('/adminLogin', admin_controller.adminlogin);
admin_route.post('/updatepassword', admin_controller.updatePassword);
admin_route.post('/forgetpassword', admin_controller.forgetPassword);
admin_route.get('/resetpassword', admin_controller.resetpassword);
admin_route.post('/adminUpdate', admin_controller.updateAdmin);
admin_route.get('/adminLogout', admin_controller.adminLogout);
admin_route.post('/uploadAdminImage', upload.single('profilepic'), admin_controller.uploadAdminImage);
admin_route.get('/getAdminById/:_id', admin_controller.getAdminById);

module.exports = admin_route;