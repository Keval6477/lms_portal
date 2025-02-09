import express from "express";
import isAutheticated from "../middlewares/isAuthenticated.js";
import {
  createCheckoutSession,
  getAllPurchasedCourse,
  getCoursrDetailWithPurchaseStatus,
  webhookController,
} from "../controllers/coursePurchase.controller.js";

const router = express.Router();
router
  .route("/checkout/create-checkout-session")
  .post(isAutheticated, createCheckoutSession);
router
  .route("/webhook")
  .post(express.raw({ type: "application/json" }), webhookController);
router
  .route("/course/:courseId/details-with-status")
  .get(isAutheticated, getCoursrDetailWithPurchaseStatus);
router.route("/get-all-purchasedCourses").get(isAutheticated,getAllPurchasedCourse);

export default router;
