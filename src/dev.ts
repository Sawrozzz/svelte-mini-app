// Local dev only — the production bundle is a library whose `mount()` the host
// runtime calls. This file is never part of the `vite build` output.
import { mount } from "./main";

mount(document.getElementById("app")!, {
  initialPath: window.location.hash.replace("#", ""),
});
