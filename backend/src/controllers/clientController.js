import Client from '../models/Client.js';

// Create client
export const createClient = async (req, res, next) => {
  try {
    const { name, company, email, contact, planType, subscriptionStatus, address, city, country } = req.body;

    const newClient = new Client({
      name,
      company,
      email,
      contact,
      planType,
      subscriptionStatus,
      address,
      city,
      country,
    });

    await newClient.save();

    res.status(201).json({
      success: true,
      message: 'Client created successfully',
      statusCode: 201,
      data: newClient,
    });
  } catch (error) {
    next(error);
  }
};

// Get all clients
export const getClients = async (req, res, next) => {
  try {
    const clients = await Client.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Clients fetched successfully',
      statusCode: 200,
      data: clients,
    });
  } catch (error) {
    next(error);
  }
};

// Get single client
export const getClientById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const client = await Client.findById(id);

    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found',
        statusCode: 404,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Client fetched successfully',
      statusCode: 200,
      data: client,
    });
  } catch (error) {
    next(error);
  }
};

// Update client
export const updateClient = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedClient = await Client.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedClient) {
      return res.status(404).json({
        success: false,
        message: 'Client not found',
        statusCode: 404,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Client updated successfully',
      statusCode: 200,
      data: updatedClient,
    });
  } catch (error) {
    next(error);
  }
};

// Delete client
export const deleteClient = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedClient = await Client.findByIdAndDelete(id);

    if (!deletedClient) {
      return res.status(404).json({
        success: false,
        message: 'Client not found',
        statusCode: 404,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Client deleted successfully',
      statusCode: 200,
    });
  } catch (error) {
    next(error);
  }
};
