import { getRepository, createQueryBuilder } from "typeorm";
import User from "../entity/User";
import { Request, Response, NextFunction } from "express";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { authConfig } from "../config/auth";

class UserController {
  async show(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const user: User = await getRepository(User)
        .createQueryBuilder("u")
        .leftJoinAndSelect("u.posts", "p")
        .where("u.id = :id", { id })
        .leftJoinAndSelect("u.comments", "c")
        .where("u.id = :id", { id })
        .orderBy("p.created_at", "DESC")
        .getOne();
      if (!user) return res.status(404).json({ error: "user not found" });
      user.password = undefined;
      return res.json(user);
    } catch (err) {
      next(err);
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
