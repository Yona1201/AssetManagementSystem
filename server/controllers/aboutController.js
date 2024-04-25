const express = require('express');
const mongoose = require("mongoose");
const About = require("../models/About");
const multer = require('multer');

const router = express.Router();


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/img");
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}.${"jpg"}`);
    },
});

const upload = multer({ storage: storage });




router.get("/", async (req, res) => {
    try {
        const about = await About.findOne();
        if (about) {
            res.status(200).json(about);
        } else {
            res.status(404).json({ message: "No documents found in the About collection." });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});




// Handle POST request for uploading and updating About document
router.post("/uploadAndUpdate", async (req, res) => {
    const { header, description, tagLine } = req.body;
    try {
        let about = await About.findOne();

        if (about) {
            // Update existing document
            about.header = header;
            about.description = description;
            about.tagLine = tagLine;
            about = await about.save();
            res.status(200).json(about);
        } else {
            // Create new document
            about = new About({ header, description, tagLine });
            about = await about.save();
            res.status(201).json(about);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.post("/upload/image", upload.single('image'), async (req, res) => {
    let about = await About.findOne();
    const imageUrl = req.file.filename;
    try {
        if (about) {
            // Update existing document
            about.image = imageUrl;
            about = await about.save();
            res.status(200).json({ message: 'success upload image' });

        } else {
            // Create new document
            about = new About({ image: imageUrl });
            about = await about.save();
            res.status(200).json({ message: 'success insert image' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
});

router.post("/upload/banner", upload.single('banner'), async (req, res) => {
    let about = await About.findOne();
    const bannerUrl = req.file.filename;
    try {
        if (about) {
            about.banner = bannerUrl;
            about = await about.save();
            res.status(200).json({ message: 'success upload banner' });
        } else {
            // Create new document
            about = new About({ banner: bannerUrl });
            about = await about.save();
            res.status(200).json({ message: 'success insert banner' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
});


module.exports = router;
