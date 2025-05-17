import { makeAutoObservable } from 'mobx';

// Store for managing user authentication state
class UserStore {
  // Observable: indicates if user is authenticated
  isAuth = false;
  // Observable: stores user data (e.g., email, name)
  user = {};

  // Constructor: initializes observables with makeAutoObservable
  constructor() {
    makeAutoObservable(this);
  }

  // Action: sets authentication status
  setAuth(bool) {
    this.isAuth = bool;
  }

  // Action: sets user data
  setUser(user) {
    this.user = user;
  }

  // Action: logs in user (temporary for testing)
  login(email) {
    this.setAuth(true);
    this.setUser({ email });
  }

  // Action: logs out user
  logout() {
    this.setAuth(false);
    this.setUser({});
  }
}

// Export singleton instance of UserStore
export const userStore = new UserStore();

// Геттеры нужны только для вычисляемых значений (например, get isAdmin() { return this.user.role === 'admin'; }).