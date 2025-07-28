const express = require("express");
const course_route = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { requireAuth } = require("../middleware/authMiddleware");

course_route.use(bodyParser.json());
course_route.use(bodyParser.urlencoded({ extended: true }));

course_route.use(cookieParser());
course_route.use(express.static('public'));
const course_controller = require("../controllers/courseController");

//course routes
course_route.post('/addCourse', course_controller.addCourse);
course_route.get('/getCourse', course_controller.getCourse);
course_route.delete('/deleteCourse/:id', course_controller.deleteCourse);
course_route.post('/editCourse', course_controller.editCourse);
course_route.get('/getCourseByInstitute/:instituteid', course_controller.getCourseByInstitute);

module.exports = course_route;