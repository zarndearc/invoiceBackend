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

// Customers Routes
app.get('/customers', async (req, res) => {
  const customers = await Customer.find();
  res.json(customers);
});

app.post('/customers', async (req, res) => {
  const { name, address, stateCode } = req.body;
  const newCustomer = new Customer({ name, address, stateCode });
  await newCustomer.save();
  res.json({ message: 'Customer added', customer: newCustomer });
});

app.delete('/customers/:id', async (req, res) => {
  await Customer.findByIdAndDelete(req.params.id);
  res.json({ message: 'Customer deleted' });
});

// Invoice Routes
app.get('/invoices', async (req, res) => {
  const invoices = await Invoice.find();
  res.json(invoices);
});

app.post('/invoices', async (req, res) => {
  const { invoiceNo, gstin, taxRate, taxableValue, cgst, sgst, igst, totalValue } = req.body;
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
});

app.delete('/invoices/:id', async (req, res) => {
  await Invoice.findByIdAndDelete(req.params.id);
  res.json({ message: 'Invoice deleted' });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
