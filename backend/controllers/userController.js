const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Users = require('../models/usersModel');
const nodemailer = require('nodemailer');

const secretKey = 'adminmanageromaragtib';

const addUser = async (req, res) => {
  const { first_name, last_name, role, user_name, email, password } = req.body;

  try {
    // Vérification si un utilisateur avec le même nom d'utilisateur ou la même adresse e-mail existe déjà
    const existingUser = await Users.findOne({
      $or: [{ user_name }, { email }],
    });
    if (existingUser) {
      return res.status(400).json({
        message:
          "Un utilisateur avec ce nom d'utilisateur ou cette adresse e-mail existe déjà.",
      });
    }

    // Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Création de l'utilisateur
    const newUser = new Users({
      first_name,
      last_name,
      user_name,
      email,
      role,
      password: hashedPassword,
      active: true, // Le compte est actif par défaut
    });

    await newUser.save();

    // Envoi d'un e-mail au nouvel utilisateur
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'Bienvenue sur notre plateforme',
      text: `Bienvenue, ${first_name}! Votre nom d'utilisateur est : ${user_name}, et votre mot de passe est : ${password}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Erreur lors de l'envoi de l'e-mail : " + error);
      } else {
        console.log('E-mail envoyé : ' + info.response);
      }
    });

    return res.status(201).json({ message: 'Utilisateur créé avec succès' });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Erreur lors de la création de l'utilisateur" });
  }
};

const loginUserq = async (req, res) => {
  const { user_name, password } = req.body;

  try {
    const user = await Users.findOne({ user_name });

    if (!user) {
      return res.status(401).json({ message: 'Authentication failed' });
    }
    // Vérifiez si l'utilisateur est actif
    if (!user.active) {
      return res
        .status(401)
        .json({ message: 'User is not active. Authentication failed' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    // Mettez à jour la date de la dernière connexion
    user.last_login = new Date();
    await user.save();

    const token = jwt.sign(
      { _id: user._id, username: user.user_name, role: user.role },
      secretKey,
      { expiresIn: '3d' }
    );
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  const { username, password } = req.body; // Updated to match frontend field names

  try {
    const user = await Users.findOne({ user_name: username }); // Updated to match frontend field names

    if (!user) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    // Check if the user is active
    if (!user.active) {
      return res
        .status(401)
        .json({ message: 'User is not active. Authentication failed' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Ivalid email or password' });
    }

    // Update the last login date
    user.last_login = new Date();
    await user.save();

    // Generate access token
    const accessToken = jwt.sign(
      { username: user.user_name, role: user.role },
      secretKey,
      { expiresIn: '1h' }
    );

    // Generate refresh token
    const refreshToken = jwt.sign(
      { username: user.user_name, role: user.role },
      secretKey,
      { expiresIn: '2h' }
    );

    // Send both tokens in the response
    res.json({user, accessToken, refreshToken });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllUsers = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 12;
  const skip = (page - 1) * limit;
  const sortDirection = req.query.sort === 'DESC' ? -1 : 1;

  try {
    const [users, totalUsers] = await Promise.all([
      Users.find()
        .sort({ createdAt: sortDirection })
        .skip(skip)
        .limit(limit)
        .exec(),
      Users.countDocuments(), // Get the total count
    ]);

    const totalPages = Math.ceil(totalUsers / limit);

    res.json({ users, totalPages });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Erreur lors de la récupération des utilisateurs' });
  }
};

const getUserById = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await Users.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des détails de l'utilisateur",
    });
  }
};

const searchForUser = async (req, res) => {
  const { query, page, sort } = req.query;
  const limit = 10;
  const skip = (page - 1) * limit;

  const sortDirection = sort === 'DESC' ? -1 : 1;

  try {
    const users = await Users.find(
      { $text: { $search: query } }, // Text search on fields
      { score: { $meta: 'textScore' } } // Include search score
    )
      .sort({ score: { $meta: 'textScore' }, createdAt: sortDirection }) // Sort by text score and createdAt
      .skip(skip)
      .limit(limit)
      .exec();

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error searching for users' });
  }
};

const updateUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const updatedUserData = req.body;

    if (updatedUserData.user_name) {
      const existingUser = await Users.findOne({
        user_name: updatedUserData.user_name,
      });
      if (existingUser && existingUser._id.toString() !== userId) {
        return res
          .status(400)
          .json({ message: "Nom d'utilisateur déjà utilisé." });
      }
    }

    // Vérifiez si l'adresse e-mail est unique (s'il a été modifié)
    if (updatedUserData.email) {
      const existingEmail = await Users.findOne({
        email: updatedUserData.email,
      });
      if (existingEmail && existingEmail._id.toString() !== userId) {
        return res
          .status(400)
          .json({ message: 'Adresse e-mail déjà utilisée.' });
      }
    }

    // // Mettez à jour la date de la dernière modification
    // updatedUserData.last_update = new Date();

    const updatedUser = await Users.findByIdAndUpdate(userId, updatedUserData);

    if (!updatedUser) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  const userId = req.params.id; // Get the user's ID from the URL parameters.

  try {
    const deletedUser = await Users.findByIdAndRemove(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting the user' });
  }
};

module.exports = {
  addUser,
  loginUser,
  getAllUsers,
  getUserById,
  searchForUser,
  updateUser,
  deleteUser,
};
