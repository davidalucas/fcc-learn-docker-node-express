const bcryptjs = require('bcryptjs');
const User = require("../models/userModel");

exports.signUp = async (req, res) => {
    try {
        const {username, password} = req.body;
        const hashpassword = await bcryptjs.hash(password, 12);
    
        const newUser = await User.create({
            username,
            password: hashpassword
        });
        
        req.session.user = newUser;

        res.status(201).json({
            status: "success",
            data: {
                user: newUser
            }
        })
    } catch (e) {
        res.status(400).json({
            status: "fail"
        })
    }
}

exports.login = async (req, res) => {
    try {
        const {username, password} = req.body;
        // const hashpassword = await bcryptjs.hash(password, 12);
    
        const user = await User.findOne({username});

        if (!user) {
            res.status(404).json({
                status: 'fail',
                message: 'user not found'
            })
        }

        const isCorrect = await bcryptjs.compare(password, user.password)

        if (isCorrect) {
            req.session.user = user;

            res.status(200).json({
                status: 'success'
            })
        } else {
            res.status(400).json({
                status: 'fail',
                message: 'incorrect username or password'
            })
        }

    } catch (e) {
        console.log(e);
        res.status(400).json({
            status: "fail"
        })
    }
}