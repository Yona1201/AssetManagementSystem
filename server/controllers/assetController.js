const express = require('express');
const mongoose = require('mongoose');

const Asset = require('../models/Asset');  // Assuming Asset model exists
const Kategori = require('../models/Category');  // Assuming Kategori model exists
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


// Create a new Asset (POST)
router.post('/', upload.single("image"), async (req, res) => {
  try {
    const newAsset = new Asset(req.body);
    const kategori = await Kategori.findById(req.body.kategori);
    if (!kategori) {
      return res.status(404).json({ error: "Kategori not found" });
    }

    const imageUrl = req.file.filename;
    newAsset.image = imageUrl;
    newAsset.kategori = kategori;
    const savedAsset = await newAsset.save();
    res.status(201).json(savedAsset);

  } catch (error) {
    console.error("Error creating asset:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get all Assets (GET)
router.get('/', async (req, res) => {
  try {
    const assets = await Asset.find().populate('kategori');
    res.status(200).json(assets);
  } catch (error) {
    console.error("Error fetching assets:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get a single Asset by ID (GET /:id)
router.get('/:id', async (req, res) => {
  try {
    const assetId = req.params.id;
    const asset = await Asset.findById(assetId).populate('kategori');
    if (!asset) {
      return res.status(404).json({ error: "Asset not found" });
    }
    res.status(200).json(asset);
  } catch (error) {
    console.error("Error fetching asset by ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update an Asset by ID (PUT /:id)
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const assetId = req.params.id;
    const updates = req.body;
    const options = { new: true }; // Return the updated asset
    if (req.file != null) {
      const imageUrl = req.file.filename;
      updates.image = imageUrl;
    } else {
      delete updates.image;
    }
    const updatedAsset = await Asset.findByIdAndUpdate(
      assetId,
      updates,
      options
    ).populate('kategori');
    if (!updatedAsset) {
      return res.status(404).json({ error: "Asset not found" });
    }
    res.status(200).json(updatedAsset);
  } catch (error) {
    console.error("Error updating asset:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete an Asset by ID (DELETE /:id)
router.delete('/:id', async (req, res) => {
  try {
    const assetId = req.params.id;
    const deletedAsset = await Asset.findByIdAndDelete(assetId);
    if (!deletedAsset) {
      return res.status(404).json({ error: "Asset not found" });
    }
    res.status(200).json({ message: "Asset deleted successfully" });
  } catch (error) {
    console.error("Error deleting asset:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
