const express = require('express');
const router = express.Router();
const { uploadFile, cleanUpload } = require('../uploads/upload.controller');



router.post('/upload', uploadFile);
router.post('/clean', cleanUpload);
     

module.exports = router;
