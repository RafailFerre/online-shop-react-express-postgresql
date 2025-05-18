import { makeAutoObservable } from 'mobx';

// Store for managing user orders
class OrderStore {
  // Observable: list of orders
  orders = [];
  // Observable: current order being created/viewed
  currentOrder = null;

  // Constructor: initializes observables
  constructor() {
    makeAutoObservable(this);
  }

  // Action: sets list of orders
  setOrders(orders) {
    this.orders = orders;
  }

  // Action: sets current order
  setCurrentOrder(order) {
    this.currentOrder = order;
  }

  // Action: creates a new order (temporary for testing)
  createOrder(items) {
    const order = {
      id: this.orders.length + 1,
      items,
      date: new Date().toISOString(),
      status: 'pending',
    };
    this.orders = [...this.orders, order];
    this.setCurrentOrder(order);
  }
}

// Export singleton instance of OrderStore
export const orderStore = new OrderStore();