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
  taxRate: '18%',
  taxableValue: { type: Number, required: true },
  cgst: { type: Number,},
  sgst: { type: Number,},
  igst: { type: Number},
  totalValue: { type: Number, required: true }
});

// Export models
const Customer = mongoose.model('Customer', customerSchema);
const Invoice = mongoose.model('Invoice', invoiceSchema);

module.exports = { Customer, Invoice };
