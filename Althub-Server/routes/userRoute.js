const express = require("express");
const user_route = express();
const bodyParser = require("body-parser");
user_route.use(bodyParser.json());
user_route.use(bodyParser.urlencoded({ extended: true }));
const multer = require("multer");
const path = require('path');
user_route.use(express.static('public'));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/userImages'), function (error, sucess) {
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
const user_controller = require("../controllers/userController");

//user routes
user_route.post('/register', user_controller.registerUser);
user_route.post('/userLogin', user_controller.userlogin);
user_route.post('/userUpdatePassword', user_controller.updatePassword);
user_route.post('/userForgetPassword', user_controller.forgetPassword);
user_route.post('/userResetPassword', user_controller.resetpassword);
user_route.post('/userProfileEdit', user_controller.userProfileEdit);
user_route.post('/searchUser', user_controller.searchUser);
user_route.post('/uploadUserImage', upload.single('profilepic'), user_controller.uploadUserImage);
user_route.post('/getTopUsers', user_controller.getTopUsers);
user_route.get('/searchUserById/:_id', user_controller.searchUserById);
user_route.get('/userLogout', user_controller.userLogout);
user_route.get('/getUsers', user_controller.getUsers);
user_route.get('/getUsersOfInstitute/:institute', user_controller.getUsersOfInstitute);
user_route.put("/follow/:id", user_controller.followUser);
user_route.put("/unfollow/:id", user_controller.unfollowUser);
user_route.delete("/deleteUser/:id", user_controller.deleteUser);

module.exports = user_route;