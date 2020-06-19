import {
  getRepository,
  createQueryBuilder,
  UpdateResult,
  DeleteResult,
} from "typeorm";
import Posts from "../entity/Posts";
import { Request, Response } from "express";

class PostController {
  async index(req: Request, res: Response) {
    try {
      const posts: Posts[] = await getRepository(Posts)
        .createQueryBuilder("p")
        .leftJoinAndSelect("p.users", "u")
        .orderBy("p.created_at", "DESC")
        .getMany();
      return res.json(posts);
    } catch (err) {
      res.status(400).json(err);
    }
  }
  async popular(req: Request, res: Response) {
    try {
      const posts: Posts[] = await getRepository(Posts)
        .createQueryBuilder("p")
        .leftJoinAndSelect("p.users", "u")
        .orderBy("p.cookies", "DESC")
        .getMany();
      return res.json(posts);
    } catch (err) {
      res.status(400).json(err);
    }
  }
  async show(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const posts: Posts = await getRepository(Posts)
        .createQueryBuilder("p")
        .leftJoinAndSelect("p.comments", "c")
        .leftJoinAndSelect("p.users", "u")
        .where("p.id = :id", { id })
        .orderBy("c.created_at", "DESC")
        .getOne();
      if (!posts) return res.status(404).json({ error: "post not found" });
      return res.json(posts);
    } catch (err) {
      res.status(400).json(err);
    }
  }
  async create(req: Request, res: Response) {
    try {
      const { title, content, userId } = req.body;
      const cookies: number = 0;
      const posts = await getRepository(Posts).save({
        title,
        content,
        cookies,
        userId,
      });
      return res.status(201).json(posts);
    } catch (err) {
      res.status(400).json(err);
    }
  }
  async addCookies(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const posts = await getRepository(Posts).findOne(id);
      if (!posts) return res.status(400).json({ error: "post not found" });
      const addCookies = await getRepository(Posts).update(id, {
        cookies: posts.cookies + 1,
      });
      return res.status(200).json({ sucess: "post updated" });
    } catch (err) {
      console.log(err);
      return res.status(400).json(err);
    }
  }
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const posts: DeleteResult = await getRepository(Posts).delete(id);
      if (posts.affected == 0)
        return res.status(404).json({ error: "post not found" });
      return res.json({ sucess: `post ${id} deleted` });
    } catch (err) {
      return res.status(400).json(err);
    }
  }
}

export default new PostController();
