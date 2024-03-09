import express from "express";
import auth, { ENUM_USER_ROLE, authorizeRoles } from "../../middleware/auth";
import { OrderController } from "./order.controller";

const router = express.Router();

router.post("/create-order", auth, OrderController.createOrder);
router.get(
  "/get-all-orders",
  auth,
  authorizeRoles(ENUM_USER_ROLE.ADMIN),
  OrderController.getAllOrders
);

router.get("/payment/stripe-key", OrderController.getStripeKey);

router.post("/payment", auth, OrderController.newPayment);

export const OrderRoutes = router;