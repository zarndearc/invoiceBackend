const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { Customer, Invoice } = require('./models');

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/customer-invoice-db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

// Serve basic web pages for viewing and adding data
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Pagination and search helper function
const paginate = async (model, filter, page, limit) => {
  const skip = (page - 1) * limit;
  const totalItems = await model.countDocuments(filter);
  const totalPages = Math.ceil(totalItems / limit);
  const results = await model.find(filter).skip(skip).limit(limit);
  
  return {
    totalItems,
    totalPages,
    currentPage: page,
    results
  };
};

// Customers Routes

// Fetch customers with pagination and search
app.get('/customers', async (req, res) => {
  const { page = 1, limit = 5, search = '' } = req.query;
  const regex = new RegExp(search, 'i'); // case-insensitive regex for search
  const filter = search ? { name: regex } : {}; // Search by name if search term exists
  try {
    const data = await paginate(Customer, filter, parseInt(page), parseInt(limit));
    res.json({ customers: data.results, totalPages: data.totalPages });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching customers' });
  }
});

// Add a new customer
app.post('/customers', async (req, res) => {
  const { name, address, stateCode } = req.body;
  try {
    const newCustomer = new Customer({ name, address, stateCode });
    await newCustomer.save();
    res.json({ message: 'Customer added', customer: newCustomer });
  } catch (error) {
    res.status(500).json({ message: 'Error adding customer' });
  }
});

// Delete a customer
app.delete('/customers/:id', async (req, res) => {
  try {
    await Customer.findByIdAndDelete(req.params.id);
    res.json({ message: 'Customer deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting customer' });
  }
});

// Invoice Routes

// Fetch invoices with pagination and search
app.get('/invoices', async (req, res) => {
  const { page = 1, limit = 5, search = '' } = req.query;
  const regex = new RegExp(search, 'i'); // case-insensitive regex for search
  const filter = search ? { invoiceNo: regex } : {}; // Search by invoice number if search term exists
  try {
    const data = await paginate(Invoice, filter, parseInt(page), parseInt(limit));
    res.json({ invoices: data.results, totalPages: data.totalPages });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching invoices' });
  }
});

// Add a new invoice
app.post('/invoices', async (req, res) => {
  const { invoiceNo, gstin, taxRate, taxableValue, cgst, sgst, igst, totalValue } = req.body;
  try {
    const newInvoice = new Invoice({
      invoiceNo,
      gstin,
      taxRate,
      taxableValue,
      cgst,
      sgst,
      igst,
      totalValue
    });
    await newInvoice.save();
    res.json({ message: 'Invoice added', invoice: newInvoice });
  } catch (error) {
    res.status(500).json({ message: 'Error adding invoice' });
  }
});

// Delete an invoice
app.delete('/invoices/:id', async (req, res) => {
  try {
    await Invoice.findByIdAndDelete(req.params.id);
    res.json({ message: 'Invoice deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting invoice' });
  }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
