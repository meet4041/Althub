const Course = require("../models/courseModel");

//Add Course
const addCourse = async (req, res) => {
    try {
        const course = new Course({
            instituteid: req.body.instituteid,
            name: req.body.name,
            stream: req.body.stream,
            duration: req.body.duration
        });

        const course_data = await course.save();
        res.status(200).send({ success: true, data: course_data });

        console.log(course);
    }
    catch (error) {
    }
}

//view Course
const getCourse = async (req, res) => {
    try {
        const course_data = await Course.find({});
        res.status(200).send({ success: true, data: course_data });
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
}

const getCourseByInstitute = async (req, res) => {
    try {
        const course_data = await Course.find({ instituteid: req.params.instituteid });
        res.status(200).send({ success: true, data: course_data });
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
}

//delete Course
const deleteCourse = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await Course.deleteOne({ _id: id });
        res.status(200).send({ success: true, msg: 'Course Deleted successfully' });
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
}

//edit event
const editCourse = async (req, res) => {
    try {
        var id = req.body.id;
        var name = req.body.name;
        var stream = req.body.stream;
        var duration = req.body.duration;

        const course_data = await Course.findByIdAndUpdate({ _id: id }, { $set: { name: name, stream: stream, duration: duration } }, { new: true });
        res.status(200).send({ success: true, msg: 'Course Updated', data: course_data });

    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
}

module.exports = {
    addCourse,
    getCourse,
    deleteCourse,
    editCourse,
    getCourseByInstitute
}