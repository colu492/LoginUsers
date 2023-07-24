import config from "../config/config.js";

export default class PersistenceFactory {
  static async getPersistence() {
    const persistenceType = config.app.persistence.toUpperCase();

    switch (persistenceType) {
      case "ARRAY":
        const { default: UsersDaoMem } = await import("./userDaoMem.js");
        return new UsersDaoMem();
      case "FILE":
        const { default: UsersDaoFile } = await import("./userDaoFile.js");
        return new UsersDaoFile();
      case "MONGO":
        const { default: UsersDaoMongo } = await import("./userDaoMongo.js");
        return new UsersDaoMongo();
      default:
        throw new Error("Invalid persistence type specified.");
    }
  }
}

