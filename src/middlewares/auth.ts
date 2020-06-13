import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { authConfig } from "../config/auth";

export default function (req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).json({ error: "No token provided" });
  const parts = authHeader.split(" ");
  if (parts.length !== 2) return res.status(401).send({ error: "Token error" });

  const [scheme, token] = parts;

  if (!scheme.includes("Bearer"))
    return res.status(400).json({ error: "Token malformatted" });

  jwt.verify(token, authConfig.secret, (err: any, decoded: any) => {
    if (err) return res.status(401).send({ error: "Invalid token" });

    req.body.authenticatedUser = decoded.id;
    return next();
  });
}
