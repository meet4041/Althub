const Education = require("../models/educationModel");

//Add education
const addEducation = async (req, res) => {
    try {
        const education = new Education({
            userid: req.body.userid,
            institutename: req.body.institutename,
            course: req.body.course,
            joindate: req.body.joindate,
            enddate: req.body.enddate,
            collagelogo: req.body.collagelogo
        });
        const education_data = await education.save();
        res.status(200).send({ success: true, data: education_data });
    } catch (error) {
    }
}

//get education
const getEducation = async (req, res) => {
    try {
        const education_data = await Education.find({ userid: req.body.userid });
        res.status(200).send({ success: true, data: education_data });
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
}

//delete education
const deleteEducation = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await Education.deleteOne({ _id: id });
        res.status(200).send({ success: true, msg: 'education Deleted successfully' });
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
}

//edit education
const editEducation = async (req, res) => {
    try {
        var id = req.body.id;
        var institutename = req.body.institutename;
        var course = req.body.course;
        var joindate = req.body.joindate;
        var enddate = req.body.enddate;
        var collagelogo = req.body.collagelogo;

        const education_data = await Education.findByIdAndUpdate({ _id: id }, { $set: { institutename: institutename, course: course, joindate: joindate, enddate: enddate, collagelogo: collagelogo } }, { new: true });
        res.status(200).send({ success: true, msg: 'education Updated', data: education_data });

    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
}
//image upload
const uploadEducationImage = async (req, res) => {
    try {
        if (req.file !== undefined) {
            const picture = ({
                url: '/educationImages/' + req.file.filename,
            });
            res.status(200).send({ success: true, data: picture });
        }
        else {
            res.status(200).send({ success: false, msg: "plz select a file" });
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}
module.exports = {
    addEducation,
    getEducation,
    deleteEducation,
    editEducation,
    uploadEducationImage
}