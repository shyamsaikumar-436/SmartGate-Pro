const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register
const register = async (req, res) => {
    const { full_name, email, phone, password, role } = req.body;

    if (!full_name || !email || !password) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const userRole = role || "customer";

        const sql = "INSERT INTO users(full_name, email, phone, password, role) VALUES(?,?,?,?,?)";

        db.query(
            sql,
            [
                full_name,
                email,
                phone || null,
                hashedPassword,
                userRole
            ],
            (err, result) => {
                if (err) {
                    if (err.code === 'ER_DUP_ENTRY') {
                        return res.status(400).json({ message: "An account with this email already exists" });
                    }
                    return res.status(500).json(err);
                }

                res.status(201).json({
                    message: "User Registered Successfully",
                    userId: result.insertId,
                    role: userRole
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

    const sql = "SELECT * FROM users WHERE email=? OR phone=?";

    db.query(sql, [email, email], async (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }

        if (result.length === 0) {
            return res.status(404).json({
                message: "User not found. Please register first."
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
            process.env.JWT_SECRET || "secret_key",
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
                phone: user.phone,
                role: user.role
            }
        });
    });
};

// Update Profile
const updateProfile = async (req, res) => {
    const { id, full_name, phone, password } = req.body;

    try {
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            const sql = "UPDATE users SET full_name = ?, phone = ?, password = ? WHERE id = ?";
            db.query(sql, [full_name, phone, hashedPassword, id], (err) => {
                if (err) return res.status(500).json(err);
                res.json({ message: "Profile Updated Successfully" });
            });
        } else {
            const sql = "UPDATE users SET full_name = ?, phone = ? WHERE id = ?";
            db.query(sql, [full_name, phone, id], (err) => {
                if (err) return res.status(500).json(err);
                res.json({ message: "Profile Updated Successfully" });
            });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

module.exports = {
    register,
    login,
    updateProfile
};