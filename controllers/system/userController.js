const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/system/userAPIModel");
const CryptoJS = require('crypto-js');
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


// Function to derive a key from a password and salt
function deriveKey(password, salt) {
    return CryptoJS.PBKDF2(password, salt, { keySize: 256 / 32, iterations: 100 });
}

// Function to decrypt data with expiration check
function decrypt(encryptedData, password) {
    // Extract salt, iv, expiration time, and encrypted data
    const saltHex = encryptedData.substr(0, 32); // First 32 characters for salt
    const ivHex = encryptedData.substr(32, 32); // Next 32 characters for IV
    const expirationTimeHex = encryptedData.substr(64, 10); // Next 10 characters for expiration time
    const encryptedHex = encryptedData.substr(74); // Remaining characters for encrypted data

    // Convert hex to WordArray
    const salt = CryptoJS.enc.Hex.parse(saltHex);
    const iv = CryptoJS.enc.Hex.parse(ivHex);
    const expirationTime = parseInt(expirationTimeHex, 10); // Convert expiration time to integer
    const encrypted = CryptoJS.enc.Base64.parse(encryptedHex); // Encrypted data is in Base64

    // Check if the current time exceeds the expiration time
    const currentTime = Math.floor(new Util().getCurrentTimeInCambodia().timestamp); // Current time in seconds
    if (currentTime > expirationTime) {
        return "expired";
    }
    // Derive the key using PBKDF2
    const key = deriveKey(password, salt);
    // Decrypt the data
    const decrypted = CryptoJS.AES.decrypt(
        { ciphertext: encrypted },
        key,
        { iv: iv }
    );
    return decrypted.toString(CryptoJS.enc.Utf8); // Return decrypted string
}

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

module.exports = { registerUser, loginUser, currentUser };
