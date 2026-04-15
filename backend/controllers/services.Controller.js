import Service from '../models/Service.model.js';

export const getServices = async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, minRating, sortBy } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (search) filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (minRating) filter.rating = { $gte: Number(minRating) };

    let query = Service.find(filter);
    switch (sortBy) {
      case 'price-low': query = query.sort({ price: 1 }); break;
      case 'price-high': query = query.sort({ price: -1 }); break;
      case 'rating': query = query.sort({ rating: -1 }); break;
      case 'reviews': query = query.sort({ reviewCount: -1 }); break;
      default: query = query.sort({ popular: -1, rating: -1 }); break;
    }

    const services = await query;
    res.json(services);
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
};

export const getService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ detail: 'Service not found' });
    res.json(service);
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
};

export const createService = async (req, res) => {
  try {
    const data = { ...req.body, technicianId: req.user.id };
    if (req.file) data.image = req.file.path;
    const service = await Service.create(data);
    res.status(201).json(service);
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
};

export const updateService = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.image = req.file.path;
    const service = await Service.findByIdAndUpdate(req.params.id, { $set: data }, { new: true });
    if (!service) return res.status(404).json({ detail: 'Service not found' });
    res.json(service);
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
};

export const deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) return res.status(404).json({ detail: 'Service not found' });
    res.json({ message: 'Service deleted' });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
};
