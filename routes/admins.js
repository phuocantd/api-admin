const express = require('express');
const router = express.Router();
const advancedSearch = require('../middleware/advancedSearch');
const Admin = require('../models/Admin');

const {
  getAdmins,
  getAdmin,
  createAdmin,
  updateAdmin,
  deleteAdmin
} = require('../controllers/admin');

const {
  protected,
  authorized
} = require('../middleware/auth');

// protected has override code below
// router.use(passport.authenticate('jwt', {session: false}));

router.use(protected);
router.use(authorized('root'));

router
  .route('/')
  .get(advancedSearch(Admin), getAdmins)
  .post(createAdmin)

router
  .route('/:id')
  .get(getAdmin)
  .put(updateAdmin)
  .delete(deleteAdmin);

module.exports = router;
