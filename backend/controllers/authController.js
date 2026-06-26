const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register
const register = async (req, res) => {

    const { full_name, email, password, role } = req.body;

    if (!full_name || !email || !password) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    try {

        const hashedPassword = await bcrypt.hash(password, 10);

        const sql =
            "INSERT INTO users(full_name,email,password,role) VALUES(?,?,?,?)";

        db.query(
            sql,
            [
                full_name,
                email,
                hashedPassword,
                role || "visitor"
            ],
            (err, result) => {

                if (err) {
                    return res.status(500).json(err);
                }

                res.status(201).json({
                    message: "User Registered Successfully"
                });

            }
        );

    } catch (error) {
        res.status(500).json(error);
    }
};

// Login
const login = (req, res) => {

    const { email, password } = req.body;

    const sql = "SELECT * FROM users WHERE email=?";

    db.query(sql, [email], async (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        if (result.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const user = result[0];

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.status(401).json({
                message: "Invalid Password"
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        res.json({
            message: "Login Successful",
            token,
            user: {
                id: user.id,
                full_name: user.full_name,
                email: user.email,
                role: user.role
            }
        });

    });

};

module.exports = {
    register,
    login
};