const User =
require("../models/userModel");

const bcrypt = require("bcrypt");
const db = require("../config/db");

const register = async (req, res) => {

    const { fullname, email, password } = req.body;

    const cleanFullname = fullname ? fullname.trim() : "";
    const cleanEmail = email ? email.trim().toLowerCase() : "";

    if (!cleanFullname || !cleanEmail || !password) {
        return res.status(400).json({
            message: "All Fields Are Required"
        });
    }

    if (cleanFullname.length < 3) {
        return res.status(400).json({
            message: "Name Must Be At Least 3 Characters"
        });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
        return res.status(400).json({
            message: "Invalid Email Format"
        });
    }

    if (password.length < 6) {
        return res.status(400).json({
            message: "Password Must Be At Least 6 Characters"
        });
    }

    const checkEmailSql = "SELECT * FROM users WHERE email = ?";

    db.query(
        checkEmailSql,
        [cleanEmail],
        async (err, result) => {

            if (err) {
                return res.status(500).json({
                    message: "Database Error"
                });
            }

            if (result.length > 0) {
                return res.status(409).json({
                    message: "Email Already Exists"
                });
            }

            // Hash password and insert user
            try {

                const hashedPassword =
                    await bcrypt.hash(password, 10);

                const sql =
                    "INSERT INTO users(fullname,email,password) VALUES(?,?,?)";

                db.query(
                    sql,
                    [cleanFullname, cleanEmail, hashedPassword],
                    (err, result) => {

                        if (err) {
                            if (err.code === "ER_DUP_ENTRY") {
                                return res.status(409).json({
                                    message: "Email Already Exists"
                                });
                            }
                            return res.status(500).json({
                                    message: "Registration Failed"
                            });
                        }

                        res.json({
                            message: "User Registered Successfully"
                        });

                    }
                );

            } catch (error) {

                res.status(500).json({
                    message: "Server Error"
                });

            }

        }
    );

};

const login = async (req, res) => {

    const { email, password } = req.body;

    const cleanEmail = email ? email.trim().toLowerCase() : "";

    if (!cleanEmail || !password) {
        return res.status(400).json({
            message: "Email and Password Are Required"
        });
    }

    const sql =
        "SELECT * FROM users WHERE email = ?";

    db.query(
        sql,
        [cleanEmail],
        async (err, result) => {

            if (err) {

                return res.status(500).json({
                    message: "Database Error"
                });

            }

            if (result.length === 0) {

                return res.status(404).json({
                    message: "User Not Found"
                });

            }

            const isMatch =
                await bcrypt.compare(
                    password,
                    result[0].password
                );

            if (!isMatch) {

                return res.status(401).json({
                    message: "Incorrect Password"
                });

            }

            res.json({
                message: "Login Successful"
            });

        }
    );

};

module.exports = {
    register,
    login
};