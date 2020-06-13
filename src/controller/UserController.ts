import { getRepository, createQueryBuilder } from "typeorm";
import User from "../entity/User";
import Posts from "../entity/Posts";
import Comments from "../entity/Comments";
import { Request, Response, NextFunction } from "express";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { authConfig } from "../config/auth";

class UserController {
  async show(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const user: User = await getRepository(User).findOne(id);
      if (!user) return res.status(404).json({ error: "user not found" });
      user.password = undefined;
      return res.json(user);
    } catch (err) {
      next(err);
    }
  }
  async userPosts(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const posts: Posts[] = await getRepository(Posts)
        .createQueryBuilder("posts")
        .where("posts.userId = :id", { id })
        .orderBy("created_at", "DESC")
        .getMany();
      return res.json(posts);
    } catch (err) {
      return res.status(400).json(err);
    }
  }
  async userComments(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const comments: Comments[] = await getRepository(Comments)
        .createQueryBuilder("comments")
        .where("comments.userId = :id", { id })
        .orderBy("created_at", "DESC")
        .getMany();
      return res.json(comments);
    } catch (err) {
      return res.status(400).json(err);
    }
  }
  async create(req: Request, res: Response, next: NextFunction) {
    let { username, email, password } = req.body;
    password = await bcrypt.hash(password, 10);
    req.body.password = password;
    const cookies: number = 0;
    try {
      const user: User = await getRepository(User).save({
        username,
        email,
        password,
        cookies,
      });
      const token: string = jwt.sign({ id: user.id }, authConfig.secret, {
        expiresIn: 86400,
      });
      return res.status(201).json({ user, token });
    } catch (err) {
      return res.status(400).json(err.message);
    }
  }

  async auth(req: Request, res: Response, next: NextFunction) {
    try {
      let { email, password } = req.body;
      const user: User = await getRepository(User)
        .createQueryBuilder("user")
        .where("email = :email", { email: email })
        .getOne();
      if (!user) return res.status(404).json({ error: "user not found" });
      if (!(await bcrypt.compare(req.body.password, user.password)))
        return res.status(400).json({ error: "Invalid password" });
      const token: string = jwt.sign({ id: user.id }, authConfig.secret, {
        expiresIn: 86400,
      });
      user.password = undefined;
      return res.json({ user, token });
    } catch (err) {
      return res.json(err);
    }
  }
}

export default new UserController();
