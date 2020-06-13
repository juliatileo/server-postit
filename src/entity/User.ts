import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  Unique,
} from "typeorm";
import Posts from "./Posts";
import Comments from "./Comments";

@Entity()
class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;
  @OneToMany(() => Posts, (posts) => posts.users)
  posts: Posts[];
  @OneToMany(() => Comments, (comments) => comments.users)
  comments: Comments[];
  @CreateDateColumn()
  created_at: Date;
}

export default User;
