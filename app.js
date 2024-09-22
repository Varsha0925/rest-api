const express = require('express');
const bodyParser = require('body-parser');
const atob = require('atob');

const app = express();
app.use(bodyParser.json({ limit: '10mb' }));

// Helper function to check if a string is a number
const isNumber = (str) => !isNaN(str);

// Helper function to decode Base64 string and validate file
const validateFile = (base64String) => {
    try {
        let fileBuffer = Buffer.from(base64String, 'base64');
        let mimeType = fileBuffer.toString('hex', 0, 4);  // Simple way to check MIME type (you can expand)
        let sizeKb = fileBuffer.length / 1024;
        return {
            isValid: true,
            mimeType: mimeType.includes('ffd8') ? 'image/jpeg' : mimeType.includes('8950') ? 'image/png' : 'application/octet-stream',
            fileSize: sizeKb.toFixed(2)
        };
    } catch (error) {
        return { isValid: false, mimeType: null, fileSize: 0 };
    }
};

// POST endpoint
app.post('/bfhl', (req, res) => {
    const { data, file_b64 } = req.body;

    // Extracting numbers and alphabets
    let numbers = data.filter(isNumber);
    let alphabets = data.filter(x => !isNumber(x));

    // Find the highest lowercase alphabet
    let lowercaseAlphabets = alphabets.filter(x => x === x.toLowerCase());
    let highestLowercaseAlphabet = lowercaseAlphabets.length > 0
        ? [lowercaseAlphabets.sort().reverse()[0]]
        : [];

    // Validate file
    let fileInfo = file_b64 ? validateFile(file_b64) : { isValid: false, mimeType: null, fileSize: 0 };

    // Response
    res.json({
        is_success: true,
        user_id: "Varsha",  // Modify to use actual user details
        email: "varsha_punuru@srmap.edu.in",  // Modify with your email
        roll_number: "AP21110010072",  // Modify with your roll number
        numbers,
        alphabets,
        highest_lowercase_alphabet: highestLowercaseAlphabet,
        file_valid: fileInfo.isValid,
        file_mime_type: fileInfo.mimeType,
        file_size_kb: fileInfo.fileSize
    });
});

// GET endpoint
app.get('/bfhl', (req, res) => {
    res.json({
        operation_code: 1
    });
});

// Starting the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
