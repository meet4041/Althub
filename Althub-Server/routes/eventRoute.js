const express = require("express");
const event_route = express();
const bodyParser = require("body-parser");
event_route.use(bodyParser.json());
event_route.use(bodyParser.urlencoded({ extended: true }));
const multer = require("multer");
const path = require('path');
event_route.use(express.static('public'));

//for file upload 
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/eventImages'), function (error, sucess) {
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
                Urls[i] = '/eventImages/' + req.files[i].filename;
                // Urls[i] = `${req.protocol}://${req.get('host')}/public/eventImages/` + req.files[i].filename;
            }
            req.images = Urls;
            next();
        }
    })
}

const upload = multer({ storage: storage }).array('photos', 5);
const event_controller = require("../controllers/eventController");

//event routes
event_route.post('/addEvent', uploadPic, event_controller.addEvents);
event_route.get('/getEvents', event_controller.getEvents);
event_route.get('/getEventsByInstitute/:organizerid', event_controller.getEventsByInstitute);
event_route.delete('/deleteEvent/:id', event_controller.deleteEvent);
event_route.post('/editEvent', uploadPic, event_controller.editEvent);
event_route.get('/searchEvent', event_controller.searchEvent);
event_route.get('/getUpcommingEvents', event_controller.getUpcommingEvents);
event_route.put("/participateInEvent/:id", event_controller.participateInEvent);

module.exports = event_route;