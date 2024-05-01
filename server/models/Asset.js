const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
  nama: {
    type: String,
    required: true,
  },
  deskripsi: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  kategori: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Kategori',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  image: {
    type: String,
  }
  // Tambahkan properti lain yang diperlukan
});

assetSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

const Asset = mongoose.model('Asset', assetSchema);

module.exports = Asset;
