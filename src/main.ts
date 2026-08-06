import { mount as mountSvelte, unmount as unmountSvelte } from "svelte";
import App from "./App.svelte";
import "./app.css";

/**
 * Entry point the host runtime calls: it hands us a container element and any
 * runtime options, and gets back a handle it can use to tear the app down.
 */
export function mount(
  container: HTMLElement,
  runtime?: { initialPath?: string },
) {
  const app = mountSvelte(App, {
    target: container,
    props: { initialPath: runtime?.initialPath },
  });

  return {
    unmount() {
      unmountSvelte(app);
    },
  };
}
