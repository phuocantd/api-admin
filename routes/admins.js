const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');

const {
  getAdmins,
  getAdmin,
  createAdmin,
  updateAdmin
} = require('../controllers/admin');

const {
  protected,
  authorized
} = require('../middleware/auth');

router.use(protected);
router.use(authorized('root'));

router
  .route('/')
  .get(getAdmins)
  .post(createAdmin);

router
  .route('/:id')
  .get(getAdmin)
  .put(updateAdmin)


module.exports = router;
