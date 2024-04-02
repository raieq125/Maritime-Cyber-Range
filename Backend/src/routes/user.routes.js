import { Router } from "express";
import { deleteUserAccount, getCurrentUser, getUserProfile, loginUser, logoutUser, refereshAccessToken, registerUser, upDateUserDetails, updateScore, getAllUsers, deleteUser} from "../controllers/user.controller.js"
import { verifyJWT, isAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser)
router.route("/login").post(loginUser);
//secured routes
router.route("/logout").get(verifyJWT, logoutUser);
router.route("/refresh-token").post(refereshAccessToken);
router.route("/currentuser").get(verifyJWT, getCurrentUser)
router.route("/update-account").patch(verifyJWT, upDateUserDetails)
router.route("/update-score").patch(verifyJWT, updateScore)
router.route("/profile/:userId").get(verifyJWT, getUserProfile)
router.route("/delete-account").delete(verifyJWT, deleteUserAccount)
//Admin Routes
router.route("/admin/alluser").get(verifyJWT, isAdmin, getAllUsers)
router.route("/admin/user/:userId").delete(verifyJWT, isAdmin, deleteUser)
export default router;