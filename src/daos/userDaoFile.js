import fs from 'fs-extra';

export default class UserDaoFile {
  constructor() {
    this.path = './data/users.json';
    this.init();
  }

  async init() {
    try {
      if (!(await fs.pathExists(this.path))) {
        await fs.writeJson(this.path, []);
      }
    } catch (error) {
      console.error('Error initializing UserDaoFile:', error);
      throw new Error('Cannot initialize UserDaoFile');
    }
  }

  async readFile() {
    try {
      return await fs.readJson(this.path);
    } catch (error) {
      console.error('Error reading users file:', error);
      throw new Error('Cannot read users file');
    }
  }

  async getAll() {
    try {
      return await this.readFile();
    } catch (error) {
      throw new Error('Cannot get users');
    }
  }

  async save(user) {
    try {
      const users = await this.readFile();
      if (users.length === 0) user.id = 1;
      else user.id = users[users.length - 1].id + 1;
      users.push(user);
      await fs.writeJson(this.path, users, { spaces: '\t' });
      return user;
    } catch (error) {
      console.error('Error saving user:', error);
      throw new Error('Cannot save user');
    }
  }
}
