const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer"); // Import Multer for file uploads
const path = require("path"); // Import the path module

// Assuming Customer model exists (replace with your actual model)
const Customer = require("../models/Customer");
const Asset = require("../models/Asset");
const Category = require("../models/Category");


const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/img");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}.${"jpg"}`);
  },
});

// Create a new customer (POST)
const upload = multer({ storage: storage });

// Endpoint untuk menangani permintaan POST
router.post("/", upload.single("image"), async (req, res) => {
  try {
    // Dapatkan data pelanggan dari permintaan body
    const customerData = req.body;

    // Dapatkan URL gambar yang diunggah dari req.file
    const imageUrl = req.file.filename;

    // Jika ada URL gambar, tambahkan ke data pelanggan
    if (imageUrl) {
      customerData.image = imageUrl;
    }
    // Buat instance Customer dengan data pelanggan
    const newCustomer = new Customer(customerData);
    // Simpan data pelanggan ke basis data
    const savedCustomer = await newCustomer.save();

    // Kirim respon sukses dengan data pelanggan yang disimpan
    res.status(201).json(savedCustomer);
  } catch (error) {
    console.error("Error creating customer:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get all customers (GET)
router.get("/", async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).json(customers);
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get a single customer by ID (GET /:id)
router.get("/:id", async (req, res) => {
  try {
    const customerId = req.params.id;
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }
    res.status(200).json(customer);
  } catch (error) {
    console.error("Error fetching customer by ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put(
  "/image/:id",
  upload.single("image"),
  async (req, res) => {
    try {
      const customerId = req.params.id;
      const updates = req.body;

      let imageFilename = null;
      if (req.file) {
        imageFilename = req.file.filename;
      } else if (updates.image) {
        // Handle existing image in request body (optional)
        imageFilename = updates.image; // Use existing image path if provided
      }
      // Update customer data with image filename (if available)
      updates.image = imageFilename;

      const options = { new: true }; // Return the updated customer

      const updatedCustomer = await Customer.findByIdAndUpdate(
        customerId,
        updates,
        options
      );
      if (!updatedCustomer) {
        return res.status(404).json({ error: "Customer not found" });
      }
      res.status(200).json(updatedCustomer);
    } catch (error) {
      console.error("Error updating customer:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// Update a customer by ID (PUT /:id)
router.put("/:id", async (req, res) => {
  try {
    const customerId = req.params.id;
    const updates = req.body;
    const options = { new: true }; // Return the updated customer

    const updatedCustomer = await Customer.findByIdAndUpdate(
      customerId,
      updates,
      options
    );
    if (!updatedCustomer) {
      return res.status(404).json({ error: "Customer not found" });
    }
    res.status(200).json(updatedCustomer);
  } catch (error) {
    console.error("Error updating customer:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete a customer by ID (DELETE /:id)
router.delete("/:id", async (req, res) => {
  try {
    const customerId = req.params.id;
    const deletedCustomer = await Customer.findByIdAndDelete(customerId);
    if (!deletedCustomer) {
      return res.status(404).json({ error: "Customer not found" });
    }
    res.status(200).json({ message: "Customer deleted successfully" });
  } catch (error) {
    console.error("Error deleting customer:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/data/count" , async(req , res)=>{
  let categoryCount = await Category.countDocuments()
  let assetCount = await Asset.countDocuments()
  let customerCount = await Customer.countDocuments()

  return res.status(200).json({
    category : categoryCount , asset : assetCount , customer : customerCount
  })
})

module.exports = router;
