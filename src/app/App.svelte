<script lang="ts">
  import Router from "svelte-spa-router";
  import { ChevronLeft, Menu } from "@lucide/svelte";
  import { onMount } from "svelte";
  import LoadError from "../components/LoadError.svelte";
  import Sidebar from "../components/Sidebar.svelte";
  import { themeState } from "../stores/appearance.ts";
  import { initSdk, sdkError, sdkPhase, sdkUser } from "../stores/sdk.ts";
  import { startHostSync } from "../router/host-sync.ts";
  import { routes } from "./routes.ts";

  let sidebarOpen = $state(true);

  let userName = $derived(
    $sdkUser?.name ??
      ($sdkUser as unknown as { fullName?: string } | null)?.fullName ??
      "Guest",
  );

  onMount(() => {
    const controller = new AbortController();
    void initSdk(controller.signal);
    const stopSync = startHostSync();
    return () => {
      controller.abort();
      stopSync();
    };
  });

  function toggleSidebar() {
    sidebarOpen = !sidebarOpen;
  }
</script>

{#if $sdkPhase === "error"}
  <LoadError message={$sdkError?.message} />
{:else if $sdkPhase === "loading"}
  <div>Connecting to platform...</div>
{:else}
  <div
    class={`flex min-h-screen relative transition-colors duration-300 ${
      $themeState.mode === "dark"
        ? "bg-linear-to-br from-slate-900 to-slate-800"
        : "bg-linear-to-br from-slate-50 to-slate-100"
    }`}
  >
    <Sidebar userName={userName} open={sidebarOpen} onToggle={toggleSidebar} />

    <main class="flex-1 overflow-y-auto min-w-0">
      <div class="sticky top-0 z-30 h-0">
        <button
          class="hidden md:flex absolute top-3 w-8 h-8 rounded-xl items-center justify-center transition-all duration-300 shadow-lg bg-white/90 backdrop-blur-sm border border-slate-200/80 text-slate-500 hover:text-slate-700 hover:bg-white hover:shadow-xl active:scale-95"
          onclick={toggleSidebar}
          style:left={sidebarOpen ? "calc(2rem - 16px)" : "12px"}
          title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          type="button"
        >
          <ChevronLeft
            class={`transition-transform duration-300 ${sidebarOpen ? "" : "rotate-180"}`}
            size={15}
          />
        </button>

        <button
          class={`md:hidden absolute top-3 left-3 w-9 h-9 rounded-xl items-center justify-center shadow-lg bg-white/90 backdrop-blur-sm border border-slate-200/80 text-slate-500 hover:text-slate-700 hover:bg-white transition-all duration-200 ${sidebarOpen ? "hidden" : "flex"}`}
          onclick={toggleSidebar}
          title="Open sidebar"
          type="button"
        >
          <Menu size={18} />
        </button>
      </div>

      <div class="pt-2">
        <Router {routes} />
      </div>
    </main>
  </div>
{/if}
