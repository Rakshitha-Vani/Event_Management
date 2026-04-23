const express = require('express');
const router = express.Router();
const { upload } = require('../config/cloudinary');
const { protect } = require('../middlewares/auth.middleware');

router.post('/', protect, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'Please upload an image' });
  }

  res.status(200).json({
    success: true,
    data: req.file.path, // This is the Cloudinary URL
  });
});

module.exports = router;
