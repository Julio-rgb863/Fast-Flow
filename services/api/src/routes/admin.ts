import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import { adminMiddleware } from "../middleware/admin";
import {
  getDashboardStats,
  listUsers,
  listAllOrders,
  createEvent,
  deleteEvent,
  promoteUser,
  deleteUser,
} from "../controllers/AdminController";

const router = Router();

// Todas as rotas abaixo exigem autenticação + role admin
router.use(authMiddleware);
router.use(adminMiddleware);

router.get("/dashboard", getDashboardStats);
router.get("/users", listUsers);
router.get("/orders", listAllOrders);
router.post("/events", createEvent);
router.delete("/events/:id", deleteEvent);
router.patch("/users/:id/promote", promoteUser);
router.delete("/users/:id", deleteUser);

export default router;