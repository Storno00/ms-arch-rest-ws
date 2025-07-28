import { Router } from "express";
import { getUsersController } from "../controllers";

const router: Router = Router();

router.get("/users", getUsersController);

export default router;
