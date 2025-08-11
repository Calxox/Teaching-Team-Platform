// src/data-source.ts
import * as dotenv from 'dotenv';
import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entities/User";
import { Course } from "./entities/Course";
import { Application } from "./entities/Application";

dotenv.config();

export const AppDataSource = new DataSource({
  type: process.env.DB_TYPE as any,        // “mysql”
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: process.env.DB_SYNCHRONIZE === 'true',
  logging: process.env.DB_LOGGING === 'true',
  entities: [User, Course, Application],
  migrations: [],
  subscribers: [],
});
