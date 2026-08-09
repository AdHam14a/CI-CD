import express from "express";
import { getUser, loginUser, registerUser } from "../controllers/user.controller";
import { verifytoken } from "../middleware/auth.middleware";
import { checkRole } from "../middleware/role.middleware";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/protected", verifytoken, (req, res) => {
  return res.json({ message: "Protected Route" });
});
router.get("/admin", verifytoken, checkRole(["admin"]), (req, res) => {
  return res.json({ message: "Admin Route" });
});

router.get("/me", verifytoken, getUser)

export default router;
