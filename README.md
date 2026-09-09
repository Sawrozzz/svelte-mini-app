# svelte-mini-app

Svelte 5 port of `test-mini-app` (React), built **only** from
`../test-mini-app`. Hash-routed with
[`svelte-spa-router`](https://github.com/ItalyPaleAle/svelte-spa-router)
(the same model as React's `HashRouter`).

## Structure

- `src/main.ts` — `mount(container, runtime?)` / `unmount()` host bridge.
  Seeds the hash **before** the Router initializes (otherwise the initial
  navigation resolves to `/` and a host `initialPath` is lost).
- `src/app/App.svelte` — thin shell: SDK gate + layout + `<Router>`.
- `src/app/routes.ts` — route table, sidebar `navItems`, `knownPaths`.
- `src/pages/` — one thin wrapper per route; binds `miniApp` state to the
  presentational tab props. `NotFoundPage` mirrors React's
  `<Navigate replace to="/" />`.
- `src/router/`
  - `location.ts` — normalized hash mirror (`currentPath` store); single
    source of truth for sidebar active state + host sync. `seedInitialPath`
    seeds a host-provided path via `replaceState` (no events).
  - `navigation.ts` — `goTo` / `replaceTo` / `stepBack`. Forward navigation
    uses `history.pushState` (never `location.hash = ...`): in Chrome a hash
    assignment also fires `popstate`, which trips the host shell's
    back-button sentinel while its `canGoBack` is still stale — the shell
    then asks the mini app to go back and the fresh route pops straight to
    `/`. `pushState` fires no events (same as React Router's hash history),
    so the in-app router is notified with a manual `hashchange` dispatch.
    Entries carry an incrementing `idx`, mirroring `createHashHistory`.
  - `host-sync.ts` — host back-button bridge: emits
    `navigation.route.changed` on every change, calls the optional
    `navigation.router.push` bridge **only on forward navigations** (never
    on POP, so the host stack can't desync), re-syncs when the SDK becomes
    ready, and answers `navigation.back.requested` by popping one route.
    Bridge activity is exposed as the `routerLog` store (Router tab).
- `src/miniapp/state.svelte.ts` — `miniApp` singleton: all domain state +
  device/SDK actions (1:1 port of React's `MiniApp/index.tsx`).
- `src/stores/` — `sdk.ts` (retry init, port of `PlatformSDKProvider`),
  `appearance.ts` (locale/theme, port of `useAppearance`).
- `src/components/tabs/` — presentational tabs (props only, no stores).
- `src/lib/` — `i18n` (port of `useT`), `types`, `retry`, `createManifest`
  (emits `manifest.json` with `framework: "svelte"`).

## Scripts

- `pnpm dev` — dev server on port 3003
- `pnpm build` — typecheck + lib build with `manifest.json`
