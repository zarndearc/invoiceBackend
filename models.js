const mongoose = require('mongoose');

// Customer Schema
const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  stateCode: { type: String, required: true }
});

// Invoice Schema
const invoiceSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  invoiceNo: { type: String, required: true },
  gstin: { type: String, required: true },
  taxRate: { type: Number, required: true },
  taxableValue: { type: Number, required: true },
  cgst: { type: Number, required: true },
  sgst: { type: Number, required: true },
  igst: { type: Number, required: true },
  totalValue: { type: Number, required: true }
});

// Export models
const Customer = mongoose.model('Customer', customerSchema);
const Invoice = mongoose.model('Invoice', invoiceSchema);

module.exports = { Customer, Invoice };
