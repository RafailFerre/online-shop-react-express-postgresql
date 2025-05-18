import { makeAutoObservable } from 'mobx';

// Store for managing shopping basket
class BasketStore {
  // Observable: list of items in the basket
  items = [];
  // Observable: total price of items
  totalPrice = 0;

  // Constructor: initializes observables
  constructor() {
    makeAutoObservable(this);
  }

  // Action: adds item to basket
  addItem(item) {
    this.items = [...this.items, item];
    this.updateTotalPrice();
  }

  // Action: removes item from basket by id
  removeItem(itemId) {
    this.items = this.items.filter(item => item.id !== itemId);
    this.updateTotalPrice();
  }

  // Action: clears basket
  clearBasket() {
    this.items = [];
    this.totalPrice = 0;
  }

  // Action: updates total price based on items
  updateTotalPrice() {
    this.totalPrice = this.items.reduce((sum, item) => sum + (item.price || 0), 0);
  }
}

// Export singleton instance of BasketStore
export const basketStore = new BasketStore();