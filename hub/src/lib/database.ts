import { createConnection } from "typeorm";

export const initializeDatabase = async () => {
  await createConnection({
    type: "postgres",
    url: "postgres://postgres:pg@localhost/hub",
    synchronize: true,
    logging: false,
    entities: ["build/entities/*.js"],
  });
};
