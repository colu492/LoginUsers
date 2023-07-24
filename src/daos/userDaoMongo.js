import mongoose from "mongoose";
import userModel from "../dao/models/user.model.js";

export default class UserDaoMongo {
  constructor() {
    this.model = mongoose.model(userModel.collectionName, userModel.schema);
  }

  async getAll() {
    try {
      const result = await this.model.find();
      return result;
    } catch (error) {
      console.error('Error getting users from MongoDB:', error);
      throw new Error('Cannot get users from MongoDB');
    }
  }

  async save(user) {
    try {
      const result = await this.model.create(user);
      return result;
    } catch (error) {
      console.error('Error saving user to MongoDB:', error);
      throw new Error('Cannot save user to MongoDB');
    }
  }
}
