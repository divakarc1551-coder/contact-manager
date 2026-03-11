import express from 'express';
const router = express.Router();
import {
  getContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
  searchContacts,
} from '../controllers/contactController.js';
import authentication from '../middleware/authMiddleware.js';
import { contactValidation, updateContactValidation } from '../utility/validators.js';
import validate from '../middleware/validation.js';

router.get('/search', authentication, searchContacts);
router.route('/')
  .get(authentication, getContacts)
  .post(authentication, contactValidation, validate, createContact);

router.route('/:id')
  .get(authentication, getContactById)
  .put(authentication, updateContactValidation, validate, updateContact)
  .delete(authentication, deleteContact);

export default router;