import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import routes from "./routes";
import { createConnection } from "typeorm";

const app = express();
createConnection();
app.use(cors());
app.use(bodyParser.json());
app.use(routes);

app.listen(process.env.PORT || 3333);
