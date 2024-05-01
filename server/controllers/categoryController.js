const express = require('express');
const mongoose = require('mongoose');

const Kategori = require('../models/Category');  // Assuming Kategori model exists

const router = express.Router();
const Asset = require('../models/Asset');


// Create a new Kategori (POST)
router.post('/', async (req, res) => {
  try {
    console.log(req.body)
    const newKategori = new Kategori({
      nama: req.body.nama,
      deskripsi: req.body.deskripsi
    });
    const savedKategori = await newKategori.save();
    res.status(201).json(savedKategori);
  } catch (error) {
    console.error("Error creating kategori:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get all Kategori (GET)
router.get('/', async (req, res) => {
  try {
    const kategori = await Kategori.find();
    res.status(200).json(kategori);
  } catch (error) {
    console.error("Error fetching kategori:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get a single Kategori by ID (GET /:id)
router.get('/:id', async (req, res) => {
  try {
    const kategoriId = req.params.id;
    const kategori = await Kategori.findById(kategoriId);
    if (!kategori) {
      return res.status(404).json({ error: "Kategori not found" });
    }
    res.status(200).json(kategori);
  } catch (error) {
    console.error("Error fetching kategori by ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update a Kategori by ID (PUT /:id)
router.put('/:id', async (req, res) => {
  try {
    const kategoriId = req.params.id;
    const updates = req.body;
    const options = { new: true }; // Return the updated kategori

    const updatedKategori = await Kategori.findByIdAndUpdate(
      kategoriId,
      updates,
      options
    );
    if (!updatedKategori) {
      return res.status(404).json({ error: "Kategori not found" });
    }
    res.status(200).json(updatedKategori);
  } catch (error) {
    console.error("Error updating kategori:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete a Kategori by ID (DELETE /:id)
router.delete('/:id', async (req, res) => {
  try {
    const kategoriId = req.params.id;

    // Hapus kategori
    const deletedKategori = await Kategori.findByIdAndDelete(kategoriId);
    if (!deletedKategori) {
      return res.status(404).json({ error: "Kategori not found" });
    }

    // Hapus semua aset yang terkait dengan kategori yang dihapus
    await Asset.deleteMany({ kategori: kategoriId });

    res.status(200).json({ message: "Kategori and related assets deleted successfully" });
  } catch (error) {
    console.error("Error deleting kategori:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
