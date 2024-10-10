export { router };

import { Router } from "express";
import {
  createTodo,
  getTodos,
  updateTodo,
  deleteTodo,
} from "../controllers/all";

const router = Router();

//  route: POST /todos/
router.post("/", createTodo);

//  route: GET /todos/
router.get("/", getTodos);

//  route: PATCH /todos/id=...
router.patch("/:id", updateTodo);

router.delete("/:id", deleteTodo);
