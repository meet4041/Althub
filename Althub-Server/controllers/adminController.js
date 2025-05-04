const Admin = require("../models/adminModel");
const bcryptjs = require("bcryptjs");
const config = require("../config/config");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const randomstring = require("randomstring");
const cookieParser = require("cookie-parser");

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

//method for generate jwt token
const createtoken = async (id) => {
    try {
        const token = jwt.sign({ _id: id }, config.secret_jwt);
        return token;
    } catch (error) {
        res.status(400).send(error.message);
    }
}

//method for password hashing
const securePassword = async (password) => {
    try {
        const passwordhash = await bcryptjs.hash(password, 10);
        return passwordhash;
    } catch (error) {
        res.status(400).send(error.message);
    }
}

//Register admin
const registerAdmin = async (req, res) => {
    try {

        const spassword = await securePassword(req.body.password);

        const admin = new Admin({
            name: req.body.lname,
            phone: req.body.phone,
            email: req.body.email,
            password: spassword,
            profilepic: req.body.profilepic,
        });

        const adminData = await Admin.findOne({ email: req.body.email });

        if (adminData) {
            res.status(400).send({ success: false, msg: "Admin already exists" });
        }
        else {

            const token = await createtoken();
            res.cookie('jwt_token', token, { httpOnly: true });
            const admin_data = await admin.save();
            res.status(200).send({ success: true, data: admin_data });

        }

    } catch (error) {
        res.status(400).send(error.message);
        console.log("Error in Register Admin : " + error.message);
    }
}

//image upload
const uploadAdminImage = async (req, res) => {
    try {
        if (req.file !== undefined) {
            const picture = ({
                url: '/adminImages/' + req.file.filename,
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

//Login admin
const adminlogin = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const adminData = await Admin.findOne({ email: email });

        if (adminData) {
            //const passwordMatch = await bcryptjs.compare(password, adminData.password);
            const passwordMatch = await (password === adminData.password);


            if (passwordMatch) {

                //method1
                const tokenData = await createtoken(adminData._id);
                res.cookie('jwt_token', tokenData, { httpOnly: true, expires: new Date(Date.now() + 1 * 60 * 60 * 1000) });

                const adminResult = {
                    _id: adminData._id,
                    name: adminData.name,
                    phone: adminData.phone,
                    email: adminData.email,
                    password: adminData.password,
                    profilepic: adminData.profilepic,
                    // token: tokenData
                }

                const response = {
                    success: true,
                    msg: "user details",
                    data: adminResult
                }

                res.status(200).send(response);
            }
            else {
                res.status(400).send({ success: false, msg: "Admin Login details are incorrect (password incorrect)" });
            }
        } else {
            res.status(400).send({ success: false, msg: "Admin Login details are incorrect (Register First)" });
        }

    } catch (error) {
        res.status(400).send(error.message);
        console.log("Error in Login Admin : " + error.message);
    }
}

//admin update password
const updatePassword = async (req, res) => {
    try {
        const admin_id = req.body.admin_id;
        var oldpassword = req.body.oldpassword;
        var newpassword = req.body.newpassword;

        const data = await Admin.findOne({ _id: admin_id });
        if (data) {
            const passwordMatch = await bcryptjs.compare(oldpassword, data.password);
            if (passwordMatch) {
                newpassword = await securePassword(newpassword);
                const adminData = await Admin.findByIdAndUpdate({ _id: admin_id }, {
                    $set: {
                        password: newpassword
                    }
                }, { new: true });

                res.status(200).send({ success: true, msg: "Your password has been updated", data: adminData });
            } else {
                res.status(400).send({ success: false, msg: "Your Old password is incorrect" });
            }
        }
        else {
            res.status(400).send({ success: false, msg: "Admin Id not found!" });
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

//forget password
const forgetPassword = async (req, res) => {
    try {
        const email = req.body.email;
        const adminData = await Admin.findOne({ email: email });
        if (adminData) {
            const randomString = randomstring.generate();
            const data = await Admin.updateOne({ email: email }, {
                $set: {
                    token: randomString
                }
            });

            sendresetpasswordMail(adminData.fname, adminData.email, randomString);

            res.status(200).send({ success: true, msg: "Please Check your inbox of mail and reset your password" });

        }
        else {
            res.status(200).send({ success: true, msg: "This Email is not exists!" });
        }

    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
}

const resetpassword = async (req, res) => {
    try {
        const token = req.query.token;
        const tokenData = await Admin.findOne({ token: token });
        if (tokenData) {
            const password = req.body.password;
            const newpassword = await securePassword(password);
            const adminData = await Admin.findByIdAndUpdate({ _id: tokenData._id }, {
                $set: {
                    password: newpassword,
                    token: ''
                }
            }, { new: true });

            res.status(200).send({ success: true, msg: "admin password has been reset!", data: adminData });
        }
        else {
            res.status(200).send({ success: true, msg: "This link has been expired!" });
        }
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
}

//admin  edit and update
const updateAdmin = async (req, res) => {
    try {
        var id = req.body.id;
        var name = req.body.name;
        var phone = req.body.phone;
        var email = req.body.email;
        var profilepic = req.body.profilepic;

        const admin_data = await Admin.findByIdAndUpdate({ _id: id }, { $set: { name: name, phone: phone, email: email, profilepic: profilepic } }, { new: true });
        res.status(200).send({ success: true, msg: 'admin Updated', data: admin_data });

    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
}


//Logout
const adminLogout = async (req, res) => {
    try {
        // res.cookie('jwt_token', '');
        res.clearCookie("jwt_token");
        res.status(200).send({ success: true, msg: "successfully Loged Out" });
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
}

//get admin by id
const getAdminById = async (req, res) => {
    try {
        const admin = await Admin.find({
            _id: req.params._id
        });
        res.status(200).send({ success: true, data: admin });
    } catch (error) {
        res.status(500).send({ success: false, msg: error.message });
    }
}

module.exports = {
    registerAdmin,
    adminlogin,
    forgetPassword,
    resetpassword,
    updatePassword,
    adminLogout,
    updateAdmin,
    uploadAdminImage,
    getAdminById
}