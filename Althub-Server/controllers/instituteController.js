const Institute = require("../models/instituteModel");
const User = require("../models/userModel");
const bcryptjs = require("bcryptjs");
const config = require("../config/config");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const randomstring = require("randomstring");

//method for password hashing
const securePassword = async (password) => {
    try {
        const passwordhash = await bcryptjs.hash(password, 10);
        return passwordhash;
    } catch (error) {
        res.status(400).send(error.message);
    }
}

//to generate token
const create_token = async (id) => {
    try {
        const token = await jwt.sign({ _id: id }, config.secret_jwt);
        return token;
    } catch (error) {
        res.status(400).send(error.message);
    }
}

//method for send mail for reset password
const sendresetpasswordMail = async (name, email, token) => {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: config.emailUser,
                pass: config.emailPassword
            }
        });
        const mailoptions = {
            from: config.emailUser,
            to: email,
            subject: 'For Reset Password',
            html: '<p>Hello ' + name + ', Please copy the link to<a href="http://localhost:3000/new-password?token=' + token + '"> reset your password</a></p>'
        }
        transporter.sendMail(mailoptions, function (error, info) {
            if (error) {
                console.log("error while sending : ", error);
            }
            else {
                console.log("Mail has been sent :- ", info.response);
            }
        })
    } catch (error) {
        console.log(error.message);
    }
}
//method for send mail for invitation
const sendInvitationMail = async (name, email, tempPass) => {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: config.emailUser,
                pass: config.emailPassword
            }
        });
        const mailoptions = {
            from: config.emailUser,
            to: email,
            subject: 'You are invited to connect Althub+',
            html: '<p>Hello ' + name + ', You are invited to connect with Althub Your Password is : ' + tempPass + '</p><p>Please Click on a link to <a href="https://localhost:3000/login">Login</a> to your Account</p>'
        }
        transporter.sendMail(mailoptions, function (error, info) {
            if (error) {
                console.log("error while sending : ", error);
            }
            else {
                console.log("Mail has been sent :- ", info.response);
            }
        })
    } catch (error) {
        console.log(error.message);
    }
}

//for register institute
const registerInstitute = async (req, res) => {
    try {
        const spassword = await securePassword(req.body.password);
        const institute = new Institute({
            name: req.body.name,
            address: req.body.address,
            phone: req.body.phone,
            email: req.body.email,
            password: spassword,
            website: req.body.website,
            image: req.body.image,
            active: req.body.active
        });
        const instituteData = await Institute.findOne({ email: req.body.email });

        if (instituteData) {
            res.status(400).send({ success: false, msg: "Institute already exists" });
        }
        else {
            const institute_data = await institute.save();
            res.status(200).send({ success: true, data: institute_data });
        }

    } catch (error) {
        res.status(400).send(error.message);
        console.log("Error in Register Institute : " + error.message);
    }
}
//image upload
const uploadInstituteImage = async (req, res) => {
    try {
        if (req.file !== undefined) {
            const picture = ({
                url: '/instituteImages/' + req.file.filename,
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

//institute login 
const instituteLogin = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const instituteData = await Institute.findOne({ email: email });

        if (instituteData) {
            const password_match = await bcryptjs.compare(password, instituteData.password);
            if (password_match) {
                const tokenData = await create_token(instituteData._id);
                const instituteResult = {
                    _id: instituteData._id,
                    name: instituteData.name,
                    address: instituteData.address,
                    phone: instituteData.mobile,
                    email: instituteData.email,
                    password: instituteData.password,
                    website: instituteData.website,
                    image: instituteData.image,
                    active: instituteData.active,
                    token: tokenData
                }
                const response = {
                    success: true,
                    msg: "institute Details",
                    data: instituteResult
                }
                res.status(200).send(response);
            }
            else {
                res.status(400).send({ success: false, msg: "Login details (password) are incorrect!" });
            }
        }
        else {
            res.status(400).send({ success: false, msg: "Login details (register first) are incorrect!" });
        }
    } catch (error) {
        res.status(400).send(error.message);
        console.log("Error in Login Institute : " + error.message);
    }
}

//user update password
const instituteUpdatePassword = async (req, res) => {
    try {
        var institute_id = req.body.institute_id;
        var oldpassword = req.body.oldpassword;
        var newpassword = req.body.newpassword;

        const data = await Institute.findOne({ _id: institute_id });
        if (data) {
            const passwordMatch = await bcryptjs.compare(oldpassword, data.password);
            if (passwordMatch) {
                newpassword = await securePassword(newpassword);
                const instituteData = await Institute.findByIdAndUpdate({ _id: institute_id }, {
                    $set: {
                        password: newpassword
                    }
                }, { new: true });

                res.status(200).send({ success: true, msg: "Your password has been updated", data: instituteData });
            } else {
                res.status(400).send({ success: false, msg: "Your Old password is incorrect" });
            }
        }
        else {
            res.status(400).send({ success: false, msg: "Institute Id not found!" });
        }

    } catch (error) {
        res.status(400).send(error.message);
    }
}

//forget password
const instituteForgetPassword = async (req, res) => {
    try {
        const email = req.body.email;
        const instituteData = await Institute.findOne({ email: email });
        if (instituteData) {
            const randomString = randomstring.generate();
            const data = await Institute.updateOne({ email: email }, {
                $set: {
                    token: randomString
                }
            });
            sendresetpasswordMail(instituteData.name, instituteData.email, randomString);
            res.status(200).send({ success: true, msg: "Please Check your inbox of mail and reset your password" });
        }
        else {
            res.status(200).send({ success: true, msg: "This Email is not exists!" });
        }
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
}

const instituteResetPassword = async (req, res) => {
    try {
        const token = req.query.token;
        const tokenData = await Institute.findOne({ token: token });
        if (tokenData) {
            const password = req.body.password;
            const newpassword = await securePassword(password);
            const instituteData = await Institute.findByIdAndUpdate({ _id: tokenData._id }, {
                $set: {
                    password: newpassword,
                    token: ''
                }
            }, { new: true });

            res.status(200).send({ success: true, msg: "user password has been reset!", data: instituteData });
        }
        else {
            res.status(200).send({ success: false, msg: "This link has been expired!" });
        }
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
}

//institute  edit and update
const updateInstitute = async (req, res) => {
    try {
        var id = req.body.id;
        var name = req.body.name;
        var address = req.body.address;
        var phone = req.body.phone;
        var email = req.body.email;
        var website = req.body.website;
        var image = req.body.image;
        var active = req.body.active

        const institute_data = await Institute.findByIdAndUpdate({ _id: id }, { $set: { name: name, address: address, phone: phone, email: email, website: website, image: image, active: active } }, { new: true });
        res.status(200).send({ success: true, msg: 'Institute Updated', data: institute_data });

    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
}

//delete institute
const deleteInstitute = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await Institute.deleteOne({ _id: id });
        res.status(200).send({ success: true, msg: 'Institute Deleted successfully' });
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
}

//view all institutes
const getInstitues = async (req, res) => {
    try {
        const institute_data = await Institute.find({});
        res.status(200).send({ success: true, data: institute_data });
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
}

//search institute by id
const searchInstituteById = async (req, res) => {
    try {
        const institute = await Institute.findById({
            _id: req.params._id
        });
        res.status(200).send({ success: true, data: institute });
    } catch (error) {
        res.status(500).send({ success: false, msg: error.message });
    }
}

//invite user
const inviteUser = async (req, res) => {
    try {
        const randpassword = randomstring.generate(5);
        const spassword = await securePassword(randpassword);
        const user = new User({
            fname: req.body.fname,
            phone: req.body.phone,
            email: req.body.email,
            password: spassword,
        });
        const userData = await User.findOne({ email: req.body.email });
        if (userData) {
            res.status(400).send({ success: false, msg: "User already exists" });
        }
        else {
            const user_data = await user.save();
            sendInvitationMail(user_data.fname, user_data.email, randpassword);
            res.status(200).send({ success: true, msg: "email sent", data: user_data });
        }

    } catch (error) {
        res.status(400).send(error.message);
        console.log("Error in invite User API : " + error.message);
    }
}

module.exports = {
    registerInstitute,
    instituteLogin,
    instituteUpdatePassword,
    instituteForgetPassword,
    instituteResetPassword,
    updateInstitute,
    deleteInstitute,
    getInstitues,
    uploadInstituteImage,
    inviteUser,
    searchInstituteById
}