<script lang="ts">
  import { ArrowLeft, ChevronsDown, Layers, Radio, Smartphone } from "@lucide/svelte";
  import { handleBackPress } from "../../router/host-sync.ts";
  import { currentPath } from "../../router/location.ts";
  import { goTo } from "../../router/navigation.ts";

  const ROUTER_ROOT = "/router";

  let {
    log,
    onBack,
  }: {
    log: string[];
    onBack: () => void;
  } = $props();

  // Depth = number of extra segments below /router (e.g. /router/level-1/level-2 => 2)
  let depth = $derived(
    $currentPath === ROUTER_ROOT || $currentPath === ""
      ? 0
      : $currentPath.startsWith(ROUTER_ROOT + "/")
        ? $currentPath.slice(ROUTER_ROOT.length).split("/").filter(Boolean).length
        : 0,
  );
  let canGoBack = $derived(depth > 0);

  function pushDeeper() {
    const base = $currentPath.replace(/\/$/, "") || ROUTER_ROOT;
    void goTo(`${base}/level-${depth + 1}`);
  }
</script>

<div class="min-h-full p-6 md:p-10 lg:p-14">
  <div class="max-w-2xl mx-auto">
    <div class="text-center mb-8">
      <div class="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-full text-blue-600 text-xs font-medium mb-4">
        <Radio size={14} />
        navigation.router
      </div>
      <h1 class="text-3xl font-bold text-slate-800">Native Back Button</h1>
      <p class="text-slate-400 text-sm mt-2 max-w-md mx-auto">
        Push a few routes, then press the phone's back button. The host asks
        first; this app pops a route and answers
        <code class="font-mono text-slate-500">consumed=true</code>
        until there is nothing left to pop.
      </p>
    </div>

    <div class="grid grid-cols-2 gap-4 mb-6">
      <div class="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5">
        <div class="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wide mb-2">
          <Layers size={14} />
          Stack depth
        </div>
        <p class="text-3xl font-bold text-slate-800">{depth}</p>
      </div>
      <div class="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5">
        <div class="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wide mb-2">
          <Smartphone size={14} />
          Next back press
        </div>
        <p class={`text-sm font-semibold mt-2 ${canGoBack ? "text-emerald-600" : "text-amber-600"}`}>
          {canGoBack ? "Handled here" : "Exits the mini app"}
        </p>
      </div>
    </div>

    <div class="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 mb-6">
      <p class="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">Current route</p>
      <p class="font-mono text-sm text-slate-700 break-all mb-5">{$currentPath}</p>

      <div class="flex flex-wrap gap-3">
        <button
          class="inline-flex items-center gap-2 bg-linear-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 transition-all duration-300 hover:scale-[1.02]"
          onclick={pushDeeper}
          type="button"
        >
          <ChevronsDown size={16} />
          Push a route
        </button>

        <button
          class="inline-flex items-center gap-2 bg-white text-slate-700 border border-slate-200 px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-slate-50 transition-all duration-200"
          onclick={() => void (onBack ? onBack() : handleBackPress())}
          type="button"
        >
          <ArrowLeft size={16} />
          Back (same path as the host)
        </button>

        {#if $currentPath !== ROUTER_ROOT}
          <button
            class="inline-flex items-center gap-2 text-slate-400 px-3 py-2.5 rounded-xl font-medium text-sm hover:text-slate-600 transition-colors"
            onclick={() => void goTo(ROUTER_ROOT)}
            type="button"
          >
            Reset
          </button>
        {/if}
      </div>
    </div>

    <div class="bg-slate-900 rounded-2xl border border-slate-800 shadow-sm p-5">
      <p class="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-3">Bridge activity</p>
      {#if log.length === 0}
        <p class="text-slate-600 text-sm font-mono">Nothing yet — push a route or press back.</p>
      {:else}
        <ul class="space-y-1.5 max-h-64 overflow-y-auto">
          {#each log as line, index (line + "-" + index)}
            <li class={`font-mono text-xs break-all ${index === 0 ? "text-emerald-400" : "text-slate-400"}`}>
              {line}
            </li>
          {/each}
        </ul>
      {/if}
    </div>
  </div>
</div>
