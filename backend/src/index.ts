import "reflect-metadata";
import * as dotenv from 'dotenv';
import express from "express";
import { AppDataSource } from "./datasource";
import userRoutes from "./routes/user_routes";
import applicationRoutes from "./routes/application_routes";
import courseRoutes from "./routes/course_routes";
import cors from "cors";
const app = express();
const PORT = process.env.PORT || 4000;

dotenv.config();

app.use(cors());
app.use(express.json());
app.use("/api", userRoutes);
app.use("/api", applicationRoutes);
app.use("/api", courseRoutes);

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) =>
    console.log("Error during Data Source initialization:", error)
  );
