import express from "express";
import auth, { ENUM_USER_ROLE, authorizeRoles } from "../../middleware/auth";
import { LayoutController } from "./layout.controller";
import singleUpload from "../../middleware/multer";

const router = express.Router();

router.post(
  "/create-layout",
  auth,
  authorizeRoles(ENUM_USER_ROLE.ADMIN),
  singleUpload,
  LayoutController.createLayout
);
router.patch(
  "/update-banner",
  auth,
  authorizeRoles(ENUM_USER_ROLE.ADMIN),
  singleUpload,
  LayoutController.updateBanner
);
router.patch(
  "/edit-layout",
  auth,
  authorizeRoles(ENUM_USER_ROLE.ADMIN),
  LayoutController.editLayout
);

router.get("/get-layout/:type", LayoutController.getLayout);

export const LayoutRoutes = router;
