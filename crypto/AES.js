const CryptoJS = require('crypto-js');
const { Util } = require("../util");

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
    const currentTime = Math.floor(new Util().getCurrentTime().timestamp); // Current time in seconds
    console.log('currentTime ::::: ' + currentTime);
    console.log('expirationTime ::::: ' + expirationTime);
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

// Function to encrypt data with expiration check
function encrypt(data, password, expirationMinutes) {
    const salt = CryptoJS.lib.WordArray.random(128 / 8); // Generate random salt
    const key = CryptoJS.PBKDF2(password, salt, { keySize: 256 / 32, iterations: 100 });
    const iv = CryptoJS.lib.WordArray.random(128 / 8); // Generate random IV

    const encrypted = CryptoJS.AES.encrypt(data, key, { iv: iv });

    // Get current timestamp and calculate expiration timestamp
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    const expirationTime = currentTime + expirationMinutes * 60; // Expiration time in seconds

    // Combine salt, iv, expiration time, and encrypted data
    const combined = salt.toString() + iv.toString() + expirationTime.toString() + encrypted.toString();
    return combined; // Return combined string
}

module.exports = { encrypt, decrypt };