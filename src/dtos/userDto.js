export default class UserDTO {
    constructor(user) {
        this.id = user.id;
        this.fullname = `${user.firstname} ${user.lastname}`;
        this.email = user.email;
    }
}
