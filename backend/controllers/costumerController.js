const Customer = require('../models/costumersModel'); // Import the Customer model.
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid'); // Import the UUID library

const secretKey = 'your-secret-key';

const createCustomer = async (req, res) => {
  const { first_name, last_name, email, password } = req.body;
  try {
    // Check if the email is unique
    const existingCustomer = await Customer.findOne({ email });
    if (existingCustomer) {
      return res.status(400).json({ message: 'Email address already in use.' });
    }
    // Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create a new customer account
    const newCustomer = new Customer({
      first_name,
      last_name,
      email,
      password: hashedPassword,
      valid_account: false, // Mark the account as not yet validated
      active: true, // Active by default
    });

    const savedCustomer = await newCustomer.save();

    // Send a validation email to the customer
    sendValidationEmail(savedCustomer);

    const token = jwt.sign(
      { email: savedCustomer.email, customerId: savedCustomer.id },
      secretKey,
      { expiresIn: '30d' }
    );

    res.json({
      _id: savedCustomer._id,
      first_name: savedCustomer.first_name,
      last_name: savedCustomer.last_name,
      email: savedCustomer.email,
      token: token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Function to send a validation email
function sendValidationEmail(customer) {
  // Configure your email service (e.g., SMTP)
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  const validationToken = generateValidationToken(); // Implement your token generation logic

  const mailOptions = {
    from: process.env.EMAIL,
    to: customer.email,
    subject: 'Account Validation',
    text: `Click the following link to validate your account: http://localhost:3001/customers/validate/${validationToken}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending validation email: ' + error);
    } else {
      console.log('Validation email sent: ' + info.response);
    }
  });
}

// Generate a unique validation token
function generateValidationToken() {
  return crypto.randomBytes(32).toString('hex'); // Generates a 64-character hexadecimal token
}

const loginCostumer = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the customer by email
    const customer = await Customer.findOne({ email });

    // Check if the customer exists
    if (!customer) {
      return res.status(401).json({ message: 'Inavalid email or password' });
    }

    // Check if the customer's account is active
    if (!customer.active) {
      return res
        .status(401)
        .json({ message: 'Account is not active. Authentication failed' });
    }

    // Compare the provided password with the stored hash
    const isPasswordValid = await bcrypt.compare(password, customer.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Inavalid email or password' });
    }

    // If the email and password are valid, generate and return a token
    const token = jwt.sign(
      { email: customer.email, customerId: customer.id },
      secretKey,
      { expiresIn: '30d' }
    );

    res.json({
      _id: customer._id,
      first_name: customer.first_name,
      last_name: customer.last_name,
      email: customer.email,
      token: token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getAllCostumers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const sort = req.query.sort || 'ASC';
    const limit = 10;
    const skip = (page - 1) * limit;

    const customers = await Customer.find()
      .sort({ _id: sort === 'DESC' ? -1 : 1 })
      .limit(limit)
      .skip(skip)
      .exec();

    const totalCustomers = await Customer.countDocuments();

    const totalPages = Math.ceil(totalCustomers / limit);

    res.json({ customers, totalPages });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const searchCostumer = async (req, res) => {
  const { query, page = 1, sort = 'ASC' } = req.query;
  const limit = 10;
  const skip = (page - 1) * limit;

  try {
    const searchQuery = {
      $or: [
        { first_name: { $regex: query, $options: 'i' } }, // Case-insensitive search on first_name
        { last_name: { $regex: query, $options: 'i' } }, // Case-insensitive search on last_name
        { email: { $regex: query, $options: 'i' } }, // Case-insensitive search on email
      ],
    };

    const customers = await Customer.find(searchQuery)
      .sort(sort === 'DESC' ? { _id: -1 } : { _id: 1 })
      .limit(limit)
      .skip(skip);

    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getCostumerById = async (req, res) => {
  const customerId = req.params.id;

  try {
    const customer = await Customer.findById(customerId);

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found.' });
    }

    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateCostumerVv = async (req, res) => {
  const customerId = req.params.id;

  try {
    // Find the customer by ID
    const customer = await Customer.findById(customerId);

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found.' });
    }

    // Update the customer's information, including the valid_account status
    customer.valid_account = true;

    // Save the updated customer data
    await customer.save();

    res.json({ message: 'Customer information updated.' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateProfile = async (req, res) => {
  const customer = await Customer.findById(req.customer._id);

  if (customer) {
    (customer.first_name = req.customer.first_name || customer.first_name),
      (customer.last_name = req.customer.last_name || customer.last_name),
      (customer.email = req.customer.email || customer.email);
    if (req.body.password) {
      customer.password = bcrypt.hash(req.body.password, 10);
    }

    const UpdateCustomer = await customer.save();
    // If the email and password are valid, generate and return a token
    const token = jwt.sign(
      { email: UpdateCustomer.email, customerId: UpdateCustomer.id },
      secretKey,
      { expiresIn: '30d' }
    );

    res.send({
      _id: UpdateCustomer._id,
      fname: UpdateCustomer.first_name,
      lname: UpdateCustomer.last_name,
      email: UpdateCustomer.email,
      token: token,
    });
  } else {
    res.status(404).send({ message: 'User not found' });
  }
};
module.exports = {
  createCustomer,
  loginCostumer,
  getAllCostumers,
  searchCostumer,
  getCostumerById,
  updateCostumerVv,
  updateProfile,
};
