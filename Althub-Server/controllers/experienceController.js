const Experience = require("../models/experienceModel");

//Add experience
const addExperience = async (req, res) => {
    try {
        const experience = new Experience({
            userid: req.body.userid,
            companyname: req.body.companyname,
            position: req.body.position,
            joindate: req.body.joindate,
            enddate: req.body.enddate,
            companylogo: req.body.companylogo,
            description: req.body.description
        });
        const experience_data = await experience.save();
        res.status(200).send({ success: true, data: experience_data });
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
}

//get experience
const getExperience = async (req, res) => {
    try {
        const experience_data = await Experience.find({ userid: req.body.userid });
        res.status(200).send({ success: true, data: experience_data });
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
}

//delete experience
const deleteExperience = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await Experience.deleteOne({ _id: id });
        res.status(200).send({ success: true, msg: 'experience Deleted successfully' });
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
}

//edit experience
const editExperience = async (req, res) => {
    try {

        const experience_data = await Experience.findByIdAndUpdate({ _id: req.body._id }, { $set: req.body }, { new: true });
        res.status(200).send({ success: true, msg: 'experience Updated', data: experience_data });

    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
}

//image upload
const uploadExperienceImage = async (req, res) => {
    try {
        if (req.file !== undefined) {
            const picture = ({
                url: '/experienceImages/' + req.file.filename,
            });
            res.status(200).send({ success: true, data: picture });
        }
        else {
            res.status(400).send({ success: false, msg: "plz select a file" });
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

module.exports = {
    addExperience,
    getExperience,
    deleteExperience,
    editExperience,
    uploadExperienceImage
}