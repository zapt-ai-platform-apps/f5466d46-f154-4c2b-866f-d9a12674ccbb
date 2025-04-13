export const events = {
  // Auth events
  USER_SIGNED_IN: 'auth/userSignedIn',
  USER_SIGNED_OUT: 'auth/userSignedOut',
  
  // Cart events
  CART_UPDATED: 'cart/updated',
  CART_ITEM_ADDED: 'cart/itemAdded',
  CART_ITEM_REMOVED: 'cart/itemRemoved',
  CART_CLEARED: 'cart/cleared',
  
  // Product events
  PRODUCT_VIEWED: 'product/viewed',
  PRODUCT_FAVORITED: 'product/favorited',
  PRODUCT_UNFAVORITED: 'product/unfavorited',
  
  // Order events
  ORDER_CREATED: 'order/created',
  ORDER_STATUS_UPDATED: 'order/statusUpdated',
  
  // User events
  USER_PROFILE_UPDATED: 'user/profileUpdated',
  USER_ADDRESS_ADDED: 'user/addressAdded',
  USER_ADDRESS_UPDATED: 'user/addressUpdated',
  USER_ADDRESS_REMOVED: 'user/addressRemoved',
  
  // Subscription events
  SUBSCRIPTION_CREATED: 'subscription/created',
  SUBSCRIPTION_UPDATED: 'subscription/updated',
  SUBSCRIPTION_CANCELLED: 'subscription/cancelled',
  
  // Notification events
  NOTIFICATION_CREATED: 'notification/created',
  NOTIFICATION_READ: 'notification/read',
};

export class EventBus {
  subscribers = {};

  subscribe(event, callback) {
    if (!this.subscribers[event]) this.subscribers[event] = [];
    this.subscribers[event].push(callback);
    return () => this.unsubscribe(event, callback);
  }

  publish(event, data) {
    if (!this.subscribers[event]) return;
    this.subscribers[event].forEach(callback => callback(data));
  }

  unsubscribe(event, callback) {
    if (!this.subscribers[event]) return;
    this.subscribers[event] = this.subscribers[event]
      .filter(cb => cb !== callback);
  }
}

export const eventBus = new EventBus();