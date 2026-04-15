import { readJSON, writeJSON } from "../lib/storage.js";

const KEY = "nexcare.session.v1";

function load() {
  return readJSON(KEY, { user: null, orders: [] });
}

function save(state) {
  writeJSON(KEY, state);
}

function createStore() {
  let state = load();
  const listeners = new Set();

  function notify() {
    for (const fn of listeners) fn(state);
  }

  return {
    getState() {
      return state;
    },
    subscribe(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
    setState(next) {
      state = next;
      save(state);
      notify();
    },
  };
}

const store = createStore();

export const session = {
  subscribe: store.subscribe,
  getUser() {
    return store.getState().user;
  },
  getOrders() {
    return store.getState().orders || [];
  },
};

export const sessionActions = {
  login({ email }) {
    const state = store.getState();
    const nameFromEmail = String(email || "")
      .split("@")[0]
      .replace(/[._-]+/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase())
      .trim();
    const user = state.user || { name: nameFromEmail || "Customer", email };
    store.setState({ ...state, user: { ...user, email } });
  },
  signup({ name, email }) {
    const state = store.getState();
    store.setState({ ...state, user: { name, email } });
  },
  logout() {
    const state = store.getState();
    store.setState({ ...state, user: null });
  },
  addOrder(order) {
    const state = store.getState();
    const orders = [order, ...(state.orders || [])];
    store.setState({ ...state, orders });
  },
  updateUser(patch) {
    const state = store.getState();
    if (!state.user) return;
    store.setState({ ...state, user: { ...state.user, ...patch } });
  },
};

