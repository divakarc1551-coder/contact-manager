import Contact from '../models/Contact.js';

// @desc    Get all contacts for logged-in user
// @route   GET /api/contacts
// @access  Private
const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });

    res.json({ success: true, count: contacts.length, contacts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single contact
// @route   GET /api/contacts/:id
// @access  Private
const getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    // Check if contact belongs to user
    if (contact.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to access this contact' });
    }

    res.json({ success: true, contact });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new contact
// @route   POST /api/contacts
// @access  Private
const createContact = async (req, res) => {
  try {
    const { name, email, phone, notes, tags } = req.body;

    const contact = await Contact.create({
      userId: req.user._id,
      name,
      email,
      phone,
      notes,
      tags: tags || [],
    });

    res.status(201).json({ success: true, contact });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update contact
// @route   PUT /api/contacts/:id
// @access  Private
const updateContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    // Check if contact belongs to user
    if (contact.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this contact' });
    }

    const { name, email, phone, notes, tags } = req.body;

    contact.name = name || contact.name;
    contact.email = email || contact.email;
    contact.phone = phone || contact.phone;
    contact.notes = notes || contact.notes;
    contact.tags = tags !== undefined ? tags : contact.tags;

    const updatedContact = await contact.save();

    res.json({ success: true, contact: updatedContact });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete contact
// @route   DELETE /api/contacts/:id
// @access  Private
const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    // Check if contact belongs to user
    if (contact.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this contact' });
    }

    await contact.deleteOne();

    res.json({ success: true, message: 'Contact deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Search contacts
// @route   GET /api/contacts/search?q=searchTerm
// @access  Private
const searchContacts = async (req, res) => {
  try {
    const searchTerm = req.query.q;

    if (!searchTerm) {
      return res.status(400).json({ message: 'Search term is required' });
    }

    const contacts = await Contact.find({
      userId: req.user._id,
      $or: [
        { name: { $regex: searchTerm, $options: 'i' } },
        { email: { $regex: searchTerm, $options: 'i' } },
        { tags: { $regex: searchTerm, $options: 'i' } },
      ],
    }).sort({ createdAt: -1 });

    res.json({ success: true, count: contacts.length, contacts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  getContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
  searchContacts,
};