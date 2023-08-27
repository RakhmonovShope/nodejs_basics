import * as authController from "../contollers/auth";

import express from 'express';

const router = express.Router();

router.get("/login", authController.getLogin);
router.get("/signup", authController.getSignup);
router.get("/reset", authController.getReset);
router.get("/reset/:token", authController.getNewPassword);

router.post("/login", authController.postLogin);
router.post("/logout", authController.postLogout);
router.post("/signup", authController.postSignup);
router.post("/reset", authController.postReset);
router.post("/new-password", authController.postNewPassword);

module.exports = router;
