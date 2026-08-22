import { Router } from "express";
import { getUser, editUserDetails, deleteUser } from "../controllers/user.controller.js";
import authorize from "../middlewares/auth.middleware.js"

const userRouter = Router();

// userRouter.get('/', authorize, getUsers);

userRouter.get('/:id', authorize, getUser);

userRouter.patch('/:id', authorize, editUserDetails);

userRouter.delete('/:id', authorize, deleteUser);

export default userRouter;