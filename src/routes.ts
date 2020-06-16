import { Router } from "express";
import userController from "./controller/UserController";
import postController from "./controller/PostController";
import commentController from "./controller/CommentController";
import auth from "./middlewares/auth";

const routes = Router();

// Users
routes.get("/users/:id", userController.show);
routes.post("/users", userController.create);
routes.post("/auth", userController.auth);

// Posts
routes.get("/posts", auth, postController.index);
routes.get("/posts/popular", auth, postController.popular);
routes.get("/posts/:id", auth, postController.show);
routes.post("/posts", auth, postController.create);
routes.delete("/posts/:id", auth, postController.delete);
routes.put("/posts/:id", auth, postController.update);

// Comments
routes.post("/comments", auth, commentController.create);
routes.delete("/comments/:id", auth, commentController.delete);
routes.put("/comments/:id", auth, commentController.update);

export default routes;
