const express = require("express");
const post_route = express();
const bodyParser = require("body-parser");
post_route.use(bodyParser.json());
post_route.use(bodyParser.urlencoded({ extended: true }));
const multer = require("multer");
const path = require('path');
post_route.use(express.static('public'));

//for file upload 
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/postImages'), function (error, sucess) {
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

//ulpload multiple files
const uploadPic = (req, res, next) => {
    upload(req, res, async (error) => {
        // console.log(req.files);
        if (error) {
            return res.status(400).send(error);
        }
        else if (!req.files) {
            return res.status(400).send("Plz select file");
        }
        else {
            let Urls = [];
            for (i = 0; i < req.files.length; i++) {
                // Urls[i] = process.env.WEB_URL + "/public/eventImages" + req.files[i].filename;
                Urls[i] = `/postImages/` + req.files[i].filename;
            }
            req.images = Urls;
            next();
        }
    })
}

const upload = multer({ storage: storage }).array('photos', 5);
const post_controller = require("../controllers/postController");

//event routes
post_route.post('/addPost', uploadPic, post_controller.addPost);
post_route.get('/getPost', post_controller.getPosts);
post_route.delete('/deletePost/:id', post_controller.deletePost);
post_route.post('/editPost', uploadPic, post_controller.editPost);
post_route.put('/like/:id', post_controller.likeUnlikePost);
post_route.get('/getFriendsPost/all', post_controller.getFriendsPost);
post_route.get('/getPostById/:userid', post_controller.getPostById);
post_route.post('/instituteAddPost', uploadPic, post_controller.instituteAddPost);

module.exports = post_route;