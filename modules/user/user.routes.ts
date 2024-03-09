import express from "express";
import { UserController } from "./user.controller";
import { ENUM_USER_ROLE, auth, authorizeRoles } from "../../middleware/auth";
import singleUpload from "../../middleware/multer";

const router = express.Router();

router.post("/registration", UserController.userRegistration);
router.post("/social-auth", UserController.socialAuth);
router.post("/activate-user", UserController.activateUser);

router.post("/login", UserController.loginUser);
router.get("/logout", auth, UserController.logoutUser);

router.get("/refresh", UserController.updateAccessToken);

router.get("/me", auth, UserController.getUserInfo);

router.patch("/update-userinfo", auth, UserController.updateUserInfo);

router.patch("/update-user-password", auth, UserController.updatePassword);

router.put(
  "/update-avatar",
  auth,
  singleUpload,
  UserController.updateProfilePicture
);

router.get(
  "/get-all-users",
  auth,
  authorizeRoles(ENUM_USER_ROLE.ADMIN),
  UserController.getAllUsers
);

router.patch(
  "/update-user-role/:email",
  auth,
  authorizeRoles(ENUM_USER_ROLE.ADMIN),
  UserController.updateRole
);

router.delete(
  "/delete-user/:userId",
  auth,
  authorizeRoles(ENUM_USER_ROLE.ADMIN),
  UserController.deleteUser
);

export const UserRoutes = router;
