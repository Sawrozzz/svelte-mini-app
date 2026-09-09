import "./app.css";
import { mount as svelteMount, unmount as svelteUnmount } from "svelte";
import App from "./app/App.svelte";
import {
  seedInitialPath,
  startLocationSync,
  stopLocationSync,
} from "./router/location.ts";

let app: object | null = null;

export function mount(
  container: HTMLElement,
  runtime?: { initialPath?: string },
) {
  // Seed the hash BEFORE mount: the Router reads the start location when it
  // initializes, so a host-provided initialPath applied afterwards would be
  // overwritten by the initial navigation resolving to /.
  seedInitialPath(runtime?.initialPath);

  // App-lifetime hash mirror: drives sidebar active state + host-router sync.
  startLocationSync();

  app = svelteMount(App, { target: container });

  return {
    unmount() {
      if (app) {
        void svelteUnmount(app);
        app = null;
      }
      stopLocationSync();
    },
  };
}

// Standalone dev-mode boot (host injects __GSA_SDK__ when embedded).
if (import.meta.env.DEV) {
  const el = document.getElementById("app");
  if (el) mount(el);
}
