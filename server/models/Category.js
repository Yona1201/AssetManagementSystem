const mongoose = require("mongoose");

const kategoriSchema = new mongoose.Schema({
  nama: {
    type: String,
    required: true,
    unique: true,
  },
  deskripsi: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  // Tambahkan properti lain yang diperlukan
});

kategoriSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Kategori = mongoose.model("Kategori", kategoriSchema);

module.exports = Kategori;
