const Company = require("../models/companyModel");

//image upload
const uploadCompanyImage = async (req, res) => {
    try {
        if (req.file !== undefined) {
            const picture = ({
                url: '/companyImages/' + req.file.filename,
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

//Add Company
const addCompany = async (req, res) => {
    try {
        const company = new Company({
            name: req.body.name,
            address: req.body.address,
            phone: req.body.phone,
            email: req.body.email,
            website: req.body.website,
            image: req.body.image
        });

        const companydata = await Company.findOne({ name: req.body.name });

        if (companydata) {
            res.status(400).send({ success: false, msg: "Company already exists" });
        }
        else {
            const company_data = await company.save();
            res.status(200).send({ success: true, data: company_data });
        }
    } catch (error) {
        res.status(400).send({ success: false, msg: "Error in Add Company" });
    }
}

//delete Company
const deleteCompany = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await Company.deleteOne({ _id: id });
        res.status(200).send({ success: true, msg: 'Company Deleted successfully' });
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
}

//view all Company
const getCompanies = async (req, res) => {
    try {
        const company_data = await Company.find({});
        res.status(200).send({ success: true, data: company_data });
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
}

//search company by id
const searchCompanyById = async (req, res) => {
    try {
        const company = await Company.findById({
            _id: req.params._id
        });
        res.status(200).send({ success: true, data: company });
    } catch (error) {
        res.status(500).send({ success: false, msg: error.message });
    }
}

module.exports = {
    addCompany,
    deleteCompany,
    getCompanies,
    searchCompanyById,
    uploadCompanyImage
}