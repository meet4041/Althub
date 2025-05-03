const express = require("express");
const company_route = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { requireAuth } = require("../middleware/authMiddleware");

company_route.use(bodyParser.json());
company_route.use(bodyParser.urlencoded({ extended: true }));
company_route.use(cookieParser());
company_route.use(express.static('public'));
const multer = require("multer");
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/companyImages'), function (error, sucess) {
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
const company_controller = require("../controllers/companyController");

//Company routes
company_route.post('/addCompany', company_controller.addCompany);
company_route.get('/getCompanies', company_controller.getCompanies);
company_route.delete('/deleteCompany/:id', company_controller.deleteCompany);
company_route.post('/uploadCompanyImage', upload.single('image'), company_controller.uploadCompanyImage);

module.exports = company_route;