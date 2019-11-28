export const fakeAuth = {
    isAuthenticated: false,

    authenticate(callback) {
        this.isAuthenticated = true;
        console.log('FakeAuth authenticated!');
        if (callback) {
            callback();
        }
    },

    signOut(callback) {
        this.isAuthenticated = false;
        sessionStorage.removeItem('token');
        console.log('FakeAuth signed out!');
        if (callback) {
            callback();
        }
    }
}
