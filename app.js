const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Initialize the Express application
const app = express();

// Enable CORS for all incoming requests
app.use(cors());

// Configure body parser to handle large JSON payloads
app.use(bodyParser.json({ limit: '50mb' }));

// POST route for handling incoming requests at /bfhl
app.post('/bfhl', (req, res) => {
    try {
        const { data, file_b64 } = req.body;
        const userId = "Varsha_Reddy_25122003";  // Replace this with dynamic user data if needed

        // Check if data exists and is an array
        if (!data || !Array.isArray(data)) {
            return res.status(400).json({ success: false, message: "Invalid input data format" });
        }

        // Separate numeric and alphabetic values from the input array
        const numbers = data.filter(item => !isNaN(item));
        const alphabets = data.filter(item => isNaN(item));
        const lowercaseAlphabets = alphabets.filter(item => /^[a-z]$/.test(item));

        // Identify the highest lowercase letter
        const maxLowercaseAlphabet = lowercaseAlphabets.length > 0
            ? [lowercaseAlphabets.sort().pop()]
            : [];

        // Handle file processing
        let isFileValid = false;
        let fileMimeType = null;
        let fileSizeKB = null;

        if (file_b64) {
            const buffer = Buffer.from(file_b64, 'base64');
            fileSizeKB = (buffer.length / 1024).toFixed(2);  // Convert bytes to KB

            // Add file validation if necessary
            isFileValid = true;
            fileMimeType = "application/octet-stream";  // Default MIME type for raw binary data
        }

        // Construct the response payload
        const responsePayload = {
            success: true,
            user_id: userId,
            email: "varsha_punuru@srmap.edu.in",
            roll_number: "AP21110010072",
            numbers: numbers,
            alphabets: alphabets,
            highest_lowercase_alphabet: maxLowercaseAlphabet,
            file_valid: isFileValid,
            file_mime_type: fileMimeType,
            file_size_kb: fileSizeKB
        };

        // Send the response back to the client
        res.json(responsePayload);
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// GET route for returning a hardcoded operation code
app.get('/bfhl', (req, res) => {
    res.json({
        operation_code: 1
    });
});

// Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
