import {
  getRepository,
  createQueryBuilder,
  DeleteResult,
  UpdateResult,
} from "typeorm";
import Comments from "../entity/Comments";
import { Request, Response } from "express";

class CommentController {
  async index(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const comments = await getRepository(Comments)
        .createQueryBuilder("c")
        .leftJoinAndSelect("c.users", "u", "c.userId = u.id")
        .where("c.postId = :id", { id })
        .getMany();
      return res.json(comments);
    } catch (err) {
      res.status(400).json(err);
    }
  }
  async create(req: Request, res: Response) {
    try {
      const { content, userId, postId } = req.body;
      const cookies = 0;
      const comments = await getRepository(Comments).save({
        content,
        cookies,
        userId,
        postId,
      });
      return res.status(201).json(comments);
    } catch (err) {
      res.status(400).json(err);
    }
  }
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const comments: DeleteResult = await getRepository(Comments).delete(id);
      if (comments.affected == 0)
        return res.status(404).json({ error: "comment not found" });
      res.status(200).json({ sucess: `comment ${id} deleted` });
    } catch (err) {
      return res.status(400).json(err);
    }
  }
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { content } = req.body;
      const comments: UpdateResult = await getRepository(Comments).update(id, {
        content,
      });
      if (comments.affected == 0)
        return res.status(404).json({ error: "comment not found" });
      return res.status(200).json({ sucess: `comment updated` });
    } catch (err) {
      res.status(400).json(err);
    }
  }
}

export default new CommentController();
