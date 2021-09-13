const productsModel = require('../models/productsModel');
const service = require('../services/productsService');

const getAllProducts = async (_req, res) => {
    try {
        const products = await productsModel.getAll();
        return res.status(200).json(products);
    } catch (error) {
        return res.status(422).json({ message: error.message });
    }
};

const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await service.getProductById(id);

        if (result.err) {
            return res.status(422).json(result);
        }
        return res.status(200).json(result);
    } catch (error) {
        return res.status(422).json({ message: error.message });
    }
};

const createProduct = async (req, res) => {
    try {
        const { name, quantity } = req.body;
        const result = await service.createProduct({ name, quantity });

        if (result.err) { 
            return res.status(422).json(result); 
        }

        return res.status(201).json(result);
    } catch (error) {
        return res.status(422).json({ message: error.message });
    }
};

const updateProduct = async (req, res) => {
    try {
        const { name, quantity } = req.body;
        const { id } = req.params;

        const result = await service.updateProduct({ id, name, quantity });
        if (result.err) { return res.status(422).json(result); }

        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await service.deleteProduct(id);

        if (result.err) { return res.status(422).json(result); }

        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllProducts, 
    createProduct,
    updateProduct,
    deleteProduct,
    getProductById,
};
