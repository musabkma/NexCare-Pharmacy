import { readJSON, writeJSON } from "../lib/storage.js";
import { clamp } from "../lib/utils.js";

const KEY = "nexcare.cart.v1";

function load() {
  return readJSON(KEY, { items: {} });
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

export const cart = {
  subscribe: store.subscribe,
  getItems() {
    return store.getState().items;
  },
  getItemCount() {
    const items = store.getState().items;
    return Object.values(items).reduce((sum, qty) => sum + qty, 0);
  },
  getSubtotal(productsById) {
    const items = store.getState().items;
    let subtotal = 0;
    for (const [id, qty] of Object.entries(items)) {
      const p = productsById.get(id);
      if (!p) continue;
      subtotal += p.price * qty;
    }
    return subtotal;
  },
  clear() {
    store.setState({ items: {} });
  },
};

export const cartActions = {
  add(id, qty = 1) {
    const state = store.getState();
    const cur = state.items[id] || 0;
    const nextQty = clamp(cur + qty, 0, 99);
    store.setState({ items: { ...state.items, [id]: nextQty } });
  },
  remove(id) {
    const state = store.getState();
    const { [id]: _removed, ...rest } = state.items;
    store.setState({ items: rest });
  },
  setQty(id, qty) {
    const state = store.getState();
    const nextQty = clamp(Number(qty || 0), 0, 99);
    if (nextQty <= 0) {
      const { [id]: _removed, ...rest } = state.items;
      store.setState({ items: rest });
      return;
    }
    store.setState({ items: { ...state.items, [id]: nextQty } });
  },
};

