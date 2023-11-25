const Product = require('../models/productsModel');
const Subcategory = require('../models/subcategoriesModel');

// const createProduct = async (req, res) => {
//   try {
//     const {
//       sku,
//       product_image,
//       product_name,
//       subcategory_id,
//       short_description,
//       long_description,
//       price,
//       discount_price,
//       options,
//     } = req.body;
//     // Vérifier si la sous-catégorie avec l'ID spécifié existe
//     const subcategory = await Subcategory.findById(subcategory_id);

//     if (!subcategory) {
//       return res
//         .status(404)
//         .json({ message: "La sous-catégorie spécifiée n'existe pas." });
//     }

//     // Check if the product name is unique
//     const existingProductByName = await Product.findOne({ product_name });
//     if (existingProductByName) {
//       return res.status(400).json({ message: 'Product name already in use.' });
//     }

//     // Check if the product SKU is unique
//     const existingProductBySku = await Product.findOne({ sku });
//     if (existingProductBySku) {
//       return res.status(400).json({ message: 'Product SKU already in use.' });
//     }

//     const newProduct = new Product({
//       sku,
//       product_image,
//       product_name,
//       subcategory_id,
//       short_description,
//       long_description,
//       price,
//       discount_price,
//       options,
//       active: false, // Set active to false by default
//     });

//     const savedProduct = await newProduct.save();

//     res.json({
//       message: 'Product created successfully.',
//       product: savedProduct,
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

const cloudinary = require('../config/cloudinaryConfig');
const handleProductImageUpload = require('../middleware/uploadMiddleware');

const createProduct = async (req, res) => {
  try {
    const {
      sku,
      product_name,
      subcategory_id,
      short_description,
      long_description,
      price,
      discount_price,
      options,
    } = req.body;

    // Vérifier si la sous-catégorie avec l'ID spécifié existe
    const subcategory = await Subcategory.findById(subcategory_id);

    if (!subcategory) {
      return res
        .status(404)
        .json({ message: "La sous-catégorie spécifiée n'existe pas." });
    }

    // Check if the product name is unique
    const existingProductByName = await Product.findOne({ product_name });
    if (existingProductByName) {
      return res.status(400).json({ message: 'Product name already in use.' });
    }

    const newProduct = new Product({
      sku,
      product_name,
      subcategory_id,
      short_description,
      long_description,
      price,
      discount_price,
      options,
      active: false, // Set active to false by default
    });

    // Handle product image upload

    // Vérifiez si une image a été téléchargée
    if (req.file) {
      newProduct.product_image = req.file.path;
    }

    // Save the new product
    const savedProduct = await newProduct.save();

    res.json({
      message: 'Product created successfully.',
      product: savedProduct,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 3 });
  }
};

module.exports = {
  createProduct,
};

const listProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    // Utilisez async/await pour récupérer les produits, peuplez les sous-catégories et les catégories
    const products = await Product.find()
      .skip(skip)
      .limit(limit)
      .populate({
        path: 'subcategory_id',
        model: 'Subcategories',
        populate: {
          path: 'category_id',
          model: 'Categories',
          select: 'category_name',
        },
      })
      .select(
        'sku product_image product_name subcategory_id short_description price discount_price options active'
      );

    // Formatage du résultat pour renommer les champs
    const formattedProducts = products.map((product) => ({
      _id: product._id,
      sku: product.sku,
      product_image: product.product_image,
      product_name: product.product_name,
      short_description: product.short_description,
      price: product.price,
      discount_price: product.discount_price,
      options: product.options,
      active: product.active,
      Subcategory: product.subcategory_id.subcategory_name,
      Category: product.subcategory_id.category_id.category_name,
    }));

    res.json(formattedProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const searchProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;
    const query = req.query.search; // Get the search query from the request query parameter

    // Use async/await to fetch products, populate subcategories, and categories
    const products = await Product.find({
      product_name: { $regex: new RegExp(query, 'i') }, // Case-insensitive search
    })
      .skip(skip)
      .limit(limit)
      .populate({
        path: 'subcategory_id',
        model: 'Subcategories',
        populate: {
          path: 'category_id',
          model: 'Categories',
          select: 'category_name',
        },
      })
      .select(
        'sku product_image product_name short_description price discount_price options active'
      );

    // Formatage du résultat pour renommer les champs
    const formattedProducts = products.map((product) => ({
      _id: product._id,
      sku: product.sku,
      product_image: product.product_image,
      product_name: product.product_name,
      short_description: product.short_description,
      price: product.price,
      discount_price: product.discount_price,
      options: product.options,
      active: product.active,
      Subcategory: product.subcategory_id.subcategory_name,
      Category: product.subcategory_id.category_id.category_name,
    }));

    res.json(formattedProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const productId = req.params.id;

    // Use Mongoose's populate method to retrieve the product and populate subcategory details
    const product = await Product.findById(productId)
      .populate({
        path: 'subcategory_id',
        model: 'Subcategories',
        populate: {
          path: 'category_id',
          model: 'Categories',
          select: 'category_name',
        },
      })
      .select(
        'sku product_image product_name short_description price discount_price options active'
      );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Extract and rename the properties for the response
    const {
      _id,
      sku,
      product_image,
      product_name,
      short_description,
      price,
      discount_price,
      options,
      active,
      subcategory_id,
    } = product;

    const response = {
      _id,
      sku,
      product_image,
      product_name,
      short_description,
      price,
      discount_price,
      options,
      active,
      Subcategory: subcategory_id.subcategory_name,
      Category: subcategory_id.category_id.category_name,
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const {
      sku,
      product_image,
      product_name,
      short_description,
      long_description,
      price,
      discount_price,
      options,
    } = req.body;

    // Check if the product ID exists
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if the product name is unique
    const existingProductByName = await Product.findOne({
      product_name,
      _id: { $ne: productId },
    });
    if (existingProductByName) {
      return res.status(400).json({ message: 'Product name already in use' });
    }

    // Update the product data
    product.sku = sku;
    product.product_image = product_image;
    product.product_name = product_name;
    product.short_description = short_description;
    product.long_description = long_description;
    product.price = price;
    product.discount_price = discount_price;
    product.options = options;

    // Save the updated product
    const updatedProduct = await product.save();

    res.json({
      message: 'Product updated successfully',
      updatedProduct,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  const productId = req.params.id;

  try {
    // You can add role-based authentication here to check if the user has admin or manager roles

    // Find the product by ID and remove it
    const deletedProduct = await Product.findByIdAndRemove(productId);

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const toutLesProduits = async (req, res) => {
  try {
    // Utilisez le modèle pour récupérer tous les produits avec le nom de modèle "Produits"
    const produits = await Product.find();

    // Envoyez la liste des produits en tant que réponse
    res.status(200).json({ produits });
  } catch (err) {
    // Gérez les erreurs ici
    res.status(500).json({ erreur: error.message });
  }
};
module.exports = {
  createProduct,
  listProducts,
  searchProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  toutLesProduits,
};
