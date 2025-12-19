const express = require('express');
const router = express.Router();
const fs = require('fs'); // Import File System
const path = require('path');

// 1. Define where to save the file
// For this challenge, we hardcode the name to 'video.mp4'. 
// (In a real app, you'd generate a unique ID per user).
const filePath = path.join(__dirname, '../uploads', 'video.mp4');

const uploadFile = (req, res) => {
    // 2. Get the chunk data
    const chunk = req.body;

    // 3. Append the chunk to the file
    // We use 'appendFileSync' to ensure the data is written BEFORE we tell the frontend to continue.
    // This prevents race conditions where chunks might arrive out of order.
    try {
        fs.appendFileSync(filePath, chunk);
        
        console.log(`Received chunk! Current file size: ${fs.statSync(filePath).size} bytes`);
        
        res.status(200).send('Chunk uploaded successfully');
    } catch (error) {
        console.error('Error writing file:', error);
        res.status(500).send('Server error');
    }
};


// OPTIONAL: A helper to delete the file so you can test again easily
// Call this endpoint (POST /api/clean) to reset the upload
const cleanUpload = (req, res) => {
    try {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            res.send('Existing file deleted. Ready for new upload.');
        } else {
            res.send('No file to delete.');
        }
    } catch (error) {
        res.status(500).send('Failed to clean upload');
    }
};


module.exports = {
    uploadFile,
    cleanUpload
};
