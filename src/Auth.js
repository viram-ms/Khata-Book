class Auth {
    constructor() {
        this.authenticated = false;
        this.token = null
    }

    login(cb) {
        this.authenticated = true;
        this.token = localStorage.getItem('Token')
        cb();
    }

    logout(cb) {
        this.authenticated = false;
        this.token = null
        cb();
    }

    getToken() {
        return this.token
    }
}

export default new Auth();