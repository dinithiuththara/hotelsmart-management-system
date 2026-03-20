export const STORE_EVENT = "hotelsmart:store";

export function emitStoreUpdate() {
  window.dispatchEvent(new Event(STORE_EVENT));
}