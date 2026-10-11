import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@prisma/client";
import config from "../config";

const adapter = new PrismaMariaDb({
  host: config.mysql.host,
  port: config.mysql.port,
  user: config.mysql.user,
  password: config.mysql.password,
  database: config.mysql.database,
  ssl: { rejectUnauthorized: false },
  connectionLimit: 5,
});

const prisma = new PrismaClient({ adapter });

export default prisma;