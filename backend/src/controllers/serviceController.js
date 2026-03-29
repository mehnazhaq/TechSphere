import Service from '../models/Service.js';

// Create service
export const createService = async (req, res, next) => {
  try {
    const { name, description, pricing, activeStatus, category } = req.body;

    const newService = new Service({
      name,
      description,
      pricing,
      activeStatus,
      category,
      createdBy: req.userId,
    });

    await newService.save();
    await newService.populate('createdBy', 'name email role');

    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      statusCode: 201,
      data: newService,
    });
  } catch (error) {
    next(error);
  }
};

// Get all services
export const getServices = async (req, res, next) => {
  try {
    const services = await Service.find()
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Services fetched successfully',
      statusCode: 200,
      data: services,
    });
  } catch (error) {
    next(error);
  }
};

// Get single service
export const getServiceById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const service = await Service.findById(id)
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found',
        statusCode: 404,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Service fetched successfully',
      statusCode: 200,
      data: service,
    });
  } catch (error) {
    next(error);
  }
};

// Update service
export const updateService = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    updates.updatedBy = req.userId;

    const updatedService = await Service.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    })
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');

    if (!updatedService) {
      return res.status(404).json({
        success: false,
        message: 'Service not found',
        statusCode: 404,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Service updated successfully',
      statusCode: 200,
      data: updatedService,
    });
  } catch (error) {
    next(error);
  }
};

// Delete service
export const deleteService = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedService = await Service.findByIdAndDelete(id);

    if (!deletedService) {
      return res.status(404).json({
        success: false,
        message: 'Service not found',
        statusCode: 404,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Service deleted successfully',
      statusCode: 200,
    });
  } catch (error) {
    next(error);
  }
};
