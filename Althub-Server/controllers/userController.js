const User = require("../models/userModel");
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

//Register user
const registerUser = async (req, res) => {
    try {
        const spassword = await securePassword(req.body.password);
        const user = new User({
            fname: req.body.fname,
            lname: req.body.lname,
            gender: req.body.gender,
            dob: req.body.dob,
            city: req.body.city,
            state: req.body.state,
            nation: req.body.nation,
            profilepic: req.body.profilepic,
            phone: req.body.phone,
            email: req.body.email,
            password: spassword,
            languages: req.body.languages,
            github: req.body.github,
            linkedin: req.body.linkedin,
            portfolioweb: req.body.portfolioweb,
            skills: req.body.skills,
            institute: req.body.institute,
            role: req.body.role,
        });

        const userData = await User.findOne({ email: req.body.email });

        if (userData) {
            res.status(400).send({ success: false, msg: "User already exists" });
        }
        else {
            const token = await createtoken();
            const user_data = await user.save();
            res.status(200).send({ success: true, data: user_data, token: token });
        }

    } catch (error) {
        res.status(400).send(error.message);
        console.log("Error in Register User : " + error.message);
    }
}

const uploadUserImage = async (req, res) => {
    try {
        if (req.file !== undefined) {
            const picture = ({
                url: '/userImages/' + req.file.filename,
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

//Login user
const userlogin = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const userData = await User.findOne({ email: email });
        if (userData) {
            const passwordMatch = await bcryptjs.compare(password, userData.password);
            if (passwordMatch) {
                const userResult = {
                    _id: userData._id,
                    fname: userData.fname,
                    lname: userData.lname,
                    gender: userData.gender,
                    dob: userData.dob,
                    address: userData.address,
                    profilepic: userData.profilepic,
                    phone: userData.phone,
                    email: userData.email,
                    password: userData.password,
                    languages: userData.languages,
                    github: userData.github,
                    linkedin: userData.linkedin,
                    portfolioweb: userData.portfolioweb,
                    skills: userData.skills,
                    role: userData.role,
                    // token: tokenData
                }

                const response = {
                    success: true,
                    msg: "user details",
                    data: userResult,
                }

                res.status(200).send(response);
            }
            else {
                res.status(400).send({ success: false, msg: "Login details are incorrect (password incorrect)", token: tokenData });
            }
        } else {
            res.status(400).send({ success: false, msg: "Login details are incorrect (Register First)" });
        }

    } catch (error) {
        res.status(400).send(error.message);
        console.log("Error in Login User : " + error.message);
    }
}

//user update password
const updatePassword = async (req, res) => {
    try {
        const user_id = req.body.user_id;
        var oldpassword = req.body.oldpassword;
        var newpassword = req.body.newpassword;
        const data = await User.findOne({ _id: user_id });
        if (data) {
            const passwordMatch = await bcryptjs.compare(oldpassword, data.password);
            if (passwordMatch) {
                newpassword = await securePassword(newpassword);
                const userData = await User.findByIdAndUpdate({ _id: user_id }, {
                    $set: {
                        password: newpassword
                    }
                }, { new: true });

                res.status(200).send({ success: true, msg: "Your password has been updated", data: userData });
            } else {
                res.status(400).send({ success: false, msg: "Your Old password is incorrect" });
            }
        }
        else {
            res.status(400).send({ success: false, msg: "User Id not found!" });
        }

    } catch (error) {
        res.status(400).send(error.message);
    }
}

//forget password
const forgetPassword = async (req, res) => {
    try {
        const email = req.body.email;
        const userData = await User.findOne({ email: email });
        if (userData) {
            const randomString = randomstring.generate();
            const data = await User.updateOne({ email: email }, {
                $set: {
                    token: randomString
                }
            });
            sendresetpasswordMail(userData.fname, userData.email, randomString);
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
        const tokenData = await User.findOne({ token: token });
        if (tokenData) {
            const password = req.body.password;
            const newpassword = await securePassword(password);
            const userData = await User.findByIdAndUpdate({ _id: tokenData._id }, {
                $set: {
                    password: newpassword,
                    token: ''
                }
            }, { new: true });

            res.status(200).send({ success: true, msg: "user password has been reset!", data: userData });
        }
        else {
            res.status(200).send({ success: true, msg: "This link has been expired!" });
        }
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
}

//user profile edit and update
const userProfileEdit = async (req, res) => {
    try {
        var id = req.body.id;
        var fname = req.body.fname;
        var lname = req.body.lname;
        var gender = req.body.gender;
        var dob = req.body.dob;
        var city = req.body.city;
        var state = req.body.state;
        var nation = req.body.nation;
        var profilepic = req.body.profilepic;
        var phone = req.body.phone;
        var email = req.body.email;
        var languages = req.body.languages;
        var github = req.body.github;
        var linkedin = req.body.linkedin;
        var portfolioweb = req.body.portfolioweb;
        var skills = req.body.skills;
        var institute = req.body.institute;
        var role = req.body.role
        var about = req.body.about
        const new_data = await User.findByIdAndUpdate({ _id: id }, { $set: { fname: fname, lname: lname, gender: gender, dob: dob, city: city, state: state, nation: nation, profilepic: profilepic, phone: phone, email: email, languages: languages, github: github, linkedin: linkedin, portfolioweb: portfolioweb, skills: skills, role: role, institute: institute, about: about } }, { new: true });

        res.status(200).send({ success: true, msg: 'User Profile Updated', data: new_data });
    }
    catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
}
//delete user
const deleteUser = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await User.deleteOne({ _id: id });
        res.status(200).send({ success: true, msg: 'user Deleted successfully' });
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
}

//search user
const searchUser = async (req, res) => {
    try {
        var search = req.body.search;
        var user_data = await User.find({
            $or: [
              { "fname": { $regex: new RegExp(".*" + search + ".*", "i") } },
              { "lname": { $regex: new RegExp(".*" + search + ".*", "i") } }
            ]
          });;
        if (user_data.length > 0) {
            res.status(200).send({ success: true, msg: "User Details", data: user_data });
        }
        else {
            res.status(200).send({ success: true, msg: 'No User Found' });
        }

    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
}
//search user by id
const searchUserById = async (req, res) => {
    try {
        const user = await User.find({
            _id: req.params._id
        });
        res.status(200).send({ success: true, data: user });
    } catch (error) {
        res.status(500).send({ success: false, msg: error.message });
    }
}

//Logout
const userLogout = async (req, res) => {
    try {
        res.clearCookie("jwt_token");
        res.status(200).send({ success: true, msg: "successfully Loged Out" });
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
}

//get all users
const getUsers = async (req, res) => {
    try {
        const user_data = await User.find({});
        res.status(200).send({ success: true, data: user_data });
    }
    catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
}
//get newly registered users
const getTopUsers = async (req, res) => {
    try {
        const user_data = await User.find({ institute: req.body.institute }).limit(5);
        res.status(200).send({ success: true, data: user_data });
    }
    catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
}

//get users of perticular institute
const getUsersOfInstitute = async (req, res) => {
    try {
        const user_data = await User.find({ institute: req.params.institute });
        res.status(200).send({ success: true, data: user_data });
    }
    catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
}

//follow a user     =>  router.put("/:id/follow"
const followUser = async (req, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if (!user.followers.includes(req.body.userId)) {
                await user.updateOne({ $push: { followers: req.body.userId } });
                await currentUser.updateOne({ $push: { followings: req.params.id } });
                res.status(200).json("user has been followed");
            } else {
                res.status(403).json("you allready follow this user");
            }
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).json("you cant follow yourself");
    }
};

//unfollow a user => router.put("/:id/unfollow")
const unfollowUser = async (req, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if (user.followers.includes(req.body.userId)) {
                await user.updateOne({ $pull: { followers: req.body.userId } });
                await currentUser.updateOne({ $pull: { followings: req.params.id } });
                res.status(200).json("user has been unfollowed");
            } else {
                res.status(403).json("you dont unfollow this user");
            }
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).json("you cant unfollow yourself");
    }
};

module.exports = {
    registerUser,
    userlogin,
    updatePassword,
    forgetPassword,
    resetpassword,
    userProfileEdit,
    searchUser,
    userLogout,
    uploadUserImage,
    getUsers,
    followUser,
    unfollowUser,
    searchUserById,
    deleteUser,
    getUsersOfInstitute,
    getTopUsers
}