import UserRepository from './userService.js';

export class IndexServices {
    static getUserRepository() {
        return new UserRepository();
    }

}
