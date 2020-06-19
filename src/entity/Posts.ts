import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import User from "./User";
import Comments from "./Comments";

@Entity()
class Posts {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  cookies: number;

  @Column()
  userId: number;
  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({ name: "userId" })
  users: User;

  @OneToMany(() => Comments, (comments) => comments.posts, {
    cascade: true,
  })
  comments: Comments[];

  @CreateDateColumn()
  created_at: Date;
}

export default Posts;
