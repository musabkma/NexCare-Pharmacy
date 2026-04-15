import { readJSON, writeJSON } from "../lib/storage.js";

const KEY = "nexcare.wishlist.v1";

function load() {
  return readJSON(KEY, { ids: [] });
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

export const wishlist = {
  subscribe: store.subscribe,
  has(id) {
    return store.getState().ids.includes(id);
  },
  all() {
    return store.getState().ids;
  },
};

export const wishlistActions = {
  toggle(id) {
    const state = store.getState();
    const set = new Set(state.ids);
    if (set.has(id)) set.delete(id);
    else set.add(id);
    store.setState({ ids: [...set] });
  },
  clear() {
    store.setState({ ids: [] });
  },
};

