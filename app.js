import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import routes from "./routes/index.js";

const app = express();

// middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// routes
routes(app);

// error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error" });
});

export default app;
