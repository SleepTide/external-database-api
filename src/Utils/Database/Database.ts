import Filesystem from "../Filesystem/Filesystem";
import Logger from "../Logger/Logger";
import mongoose from "mongoose";

export default class Database {
  constructor() {
    this.Start();
  }

  private Start() {
    Logger.Info("Connecting to database...");

    const config = Filesystem.ReadConfig();

    mongoose
      .connect(config.database.uri)
      .then(() => {
        Logger.Info("Connected to database!");
      })
      .catch((error) => {
        Logger.Error("Failed to connect to database:", error);
        process.exit(1);
      });

    return;
  }
}
