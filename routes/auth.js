import * as authController from '../contollers/auth';
import User from '../models/user';

import express from 'express';
import { body, check } from 'express-validator/check';

const router = express.Router();

router.get('/login', authController.getLogin);
router.get('/signup', authController.getSignup);
router.get('/reset', authController.getReset);
router.get('/reset/:token', authController.getNewPassword);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('invalid email').normalizeEmail().trim(),
    body('password', 'Password has to be valid').isLength({ min: 5 }).isAlphanumeric().trim()
  ],
  authController.postLogin
);
router.post('/logout', authController.postLogout);
router.post(
  '/signup',
  [
    check('email')
      .isEmail()
      .withMessage('Please enter a valid email!')
      .custom((email, { req }) => {
        return User.findOne({ email }).then(user => {
          if (user) {
            return Promise.reject('Email is already exist, please pick another one');
          }
        });
      })
      .normalizeEmail()
      .trim(),
    body('password', 'Please enter only number and alphabetical string at least 5 characteristics')
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
    body('confirmPassword')
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw Error('Password do have to match!');
        }

        return true;
      })
  ],
  authController.postSignup
);
router.post('/reset', authController.postReset);
router.post('/new-password', authController.postNewPassword);

module.exports = router;
