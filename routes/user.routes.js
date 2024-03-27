const express = require("express");
const { UserModel } = require("../models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userRouter = express.Router();



userRouter.get("/", (req, res) => {

    res.send("All the user ");

})

userRouter.get("/check-email/:email", async (req, res) => {
    const { email } = req.params;
    try {
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            res.send({ exists: true });
        } else {
            res.send({ exists: false });
        }
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});


userRouter.post("/register", async (req, res) => {
    const { name, email, password } = req.body;
    bcrypt.hash(password, 5, async function (err, hash) {

        if (err) return res.send({ message: "something went wrong ", status: 0 });
        try {
            let user = new UserModel({ name, email, password: hash });
            await user.save();
            res.send({
                message: "User created",
                status: 1
            })
        } catch (error) {
            res.send({
                message: error.message,
                status: 0
            })
        }


    });
})

userRouter.post("/login", async (req, res) => {
    const { email, password } = req.body
    let option = {
        expiresIn: "5m"
    }

    try {
        let data = await UserModel.find({ email })
        if (data.length > 0) {

            let token = jwt.sign({ userId: data[0]._id }, "daksh", option)
            bcrypt.compare(password, data[0].password, function (err, result) {
                if (err) return res.send({ message: "somthing went wrong " + err, status: 0 })
                if (result) {
                    res.send({
                        message: "user logged in successfully",
                        token: token,
                        status: 1
                    })
                } else {
                    res.send({
                        message: "password is incorrect",
                        status: 0
                    })
                }
            });
        } else {
            res.send({
                message: "User does not exist",
                status: 0
            })
        }
    } catch (error) {

        res.send({
            message: error.message,
            status: 0
        })

    }



})

module.exports = { userRouter }