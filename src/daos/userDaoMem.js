export default class UsersDaoMem {
    constructor() {
      this.users = [];
    }
  
    async getAll() {
      try {
        return this.users;
      } catch (error) {
        throw new Error('Cannot get users');
      }
    }
  
    async save(user) {
      try {
        if (this.users.length === 0) user.id = 1;
        else user.id = this.users[this.users.length - 1].id + 1;
        this.users.push(user);
        return user;
      } catch (error) {
        console.error('Error saving user:', error);
        throw new Error('Cannot save user');
      }
    }
  }
  