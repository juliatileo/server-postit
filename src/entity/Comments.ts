import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import User from "./User";
import Posts from "./Posts";

@Entity()
class Comments {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Column()
  cookies: number;

  @Column()
  userId: number;
  @ManyToOne(() => User, (user) => user.comments)
  @JoinColumn({ name: "userId" })
  users: User;

  @Column()
  postId: number;
  @ManyToOne(() => Posts, (posts) => posts.comments)
  @JoinColumn({ name: "postId" })
  posts: Posts;

  @CreateDateColumn()
  created_at: Date;
}

export default Comments;
