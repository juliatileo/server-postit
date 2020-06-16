import {
  getRepository,
  createQueryBuilder,
  UpdateResult,
  DeleteResult,
} from "typeorm";
import Posts from "../entity/Posts";
import Comments from "../entity/Comments";
import User from "../entity/User";
import { Request, Response } from "express";

class PostController {
  async index(req: Request, res: Response) {
    const posts: Posts[] = await getRepository(Posts)
      .createQueryBuilder("posts")
      .orderBy("created_at", "DESC")
      .getMany();
    return res.json(posts);
  }
  async popular(req: Request, res: Response) {
    const posts: Posts[] = await getRepository(Posts)
      .createQueryBuilder("posts")
      .orderBy("cookies", "DESC")
      .getMany();
    return res.json(posts);
  }
  async postComments(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const comments = await getRepository(Comments)
        .createQueryBuilder("comments")
        .where("comments.postId = :id", { id })
        .orderBy("created_at", "DESC")
        .getMany();
      return res.status(200).json(comments);
    } catch (err) {
      res.status(400).json(err);
    }
  }
  async show(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const posts: Posts = await getRepository(Posts).findOne(id);
      const user = await getRepository(User)
        .createQueryBuilder("user")
        .where("user.id = :id", { id: posts.userId })
        .getOne();
      if (!posts) return res.status(404).json({ error: "post not found" });
      user.password = undefined;
      return res.json({ posts, user });
    } catch (err) {
      res.status(400).json(err);
    }
  }
  async create(req: Request, res: Response) {
    try {
      const { title, content, userId } = req.body;
      const cookies: number = 0;
      const user = await getRepository(Posts).save({
        title,
        content,
        cookies,
        userId,
      });
      return res.status(201).json(user);
    } catch (err) {
      res.status(400).json(err);
    }
  }
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { title, content } = req.body;
      const posts: UpdateResult = await getRepository(Posts).update(id, {
        title,
        content,
      });
      if (posts.affected == 0)
        return res.status(404).json({ error: "post not found" });
      return res.status(200).json({ sucess: "post updated" });
    } catch (err) {
      res.status(400).json(err);
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
