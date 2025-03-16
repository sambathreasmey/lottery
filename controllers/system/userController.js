const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/system/userAPIModel");
const { encrypt, decrypt } = require("../../crypto/AES");
const { Util } = require("../../util");

//@desc Register a user
//@route POST /api/users/register
//@access public
const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        res.status(400);
        throw new Error("All fields are mandatory!");
    }
    const userAvailable = await User.findOne({ email });
    if (userAvailable) {
        res.status(400);
        throw new Error("User already registered!");
    }

    //Hash password
    const hashPassword = await bcrypt.hash(password, 10);
    console.log("Hashed Password : ", hashPassword);
    const user = await User.create({
        username,
        email,
        password: hashPassword,
    });
    
    if (user) {
        res.status(201).json({ _id: user.id, email: user.email });
    } else {
        res.status(400);
        throw new Error({ message: "Register the user" });
    }
    res.json({ message: "Register the user" });
});

//@desc Login a user
//@route POST /api/users/login
//@access public
const loginUser = asyncHandler(async (req, res) => {

    const { encryptedData } = req.body;

    const jsonString = decrypt(encryptedData, process.env.AES_PASSWORD);
    if (jsonString == "expired") {
        res.status(400);
        throw new Error("The session has expired!");
    }
    const jsonObject = JSON.parse(jsonString);

    const { email, password } = jsonObject;
    if (!email || !password) {
        res.status(400);
        throw new Error("All fields are mandatory!");
    }
    const user = await User.findOne({ email });
    //compare password with hashedpassword
    if (user && (await bcrypt.compare(password, user.password))) {
        const accessToken = jwt.sign({
            user: {
                username: user.username,
                email: user.email,
                id: user.id,
            },
        }, process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "35m" }
        );
        res.status(200).json({ accessToken });
    } else {
        res.status(401);
        throw new Error("email or password is not valid");
    }
});

//@desc current a user
//@route POST /api/users/current
//@access private
const currentUser = asyncHandler(async (req, res) => {
    res.json(req.user);
});

//@desc current a user
//@route POST /api/users/developer_mode
//@access private
const developerMode = asyncHandler(async (req, res) => {
    const jsonString = JSON.stringify(req.body);
    res.json({encryptedData: encrypt(jsonString,  process.env.AES_PASSWORD, 60)});
});


module.exports = { registerUser, loginUser, currentUser, developerMode };
