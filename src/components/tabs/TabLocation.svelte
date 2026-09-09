<script lang="ts">
  import { Compass, Cpu, Globe, Loader, MapPin } from "@lucide/svelte";

  let {
    loadLocation,
    location,
    sdkError,
    loadBrowserLocation,
    browserLocation,
    browserError,
    onViewSdkLocation,
    onViewBrowserLocation,
  }: {
    loadLocation: boolean;
    location: SdkDeviceLocationResult | null;
    sdkError: string;
    loadBrowserLocation: boolean;
    browserLocation: SdkDeviceLocationResult | null;
    browserError: string | null;
    onViewSdkLocation: () => void;
    onViewBrowserLocation: () => void;
  } = $props();
</script>

{#snippet locationGrid(loc: SdkDeviceLocationResult)}
  <div class="grid grid-cols-2 gap-3">
    <div class="bg-slate-50 rounded-xl p-4 border border-slate-100">
      <p class="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Latitude</p>
      <p class="text-slate-800 font-semibold text-sm font-mono">{loc.latitude}</p>
    </div>
    <div class="bg-slate-50 rounded-xl p-4 border border-slate-100">
      <p class="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Longitude</p>
      <p class="text-slate-800 font-semibold text-sm font-mono">{loc.longitude}</p>
    </div>
    {#if loc.accuracy !== undefined}
      <div class="bg-slate-50 rounded-xl p-4 border border-slate-100">
        <p class="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Accuracy</p>
        <p class="text-slate-800 font-semibold text-sm font-mono">{loc.accuracy}m</p>
      </div>
    {/if}
    {#if loc.timestamp}
      <div class="bg-slate-50 rounded-xl p-4 border border-slate-100">
        <p class="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Timestamp</p>
        <p class="text-slate-800 font-semibold text-sm font-mono truncate">
          {new Date(loc.timestamp).toLocaleString()}
        </p>
      </div>
    {/if}
  </div>
{/snippet}

{#snippet locationCard(title: string, color: "emerald" | "indigo", loc: SdkDeviceLocationResult | null, isLoading: boolean, error: string, onView: () => void)}
  {@const badge = color === "emerald"
    ? "bg-emerald-50 border-emerald-100 text-emerald-600"
    : "bg-indigo-50 border-indigo-100 text-indigo-600"}
  {@const loaderColor = color === "emerald" ? "text-emerald-500" : "text-indigo-500"}
  {@const btnGradient = color === "emerald"
    ? "from-emerald-600 to-teal-600 shadow-emerald-600/25 hover:shadow-emerald-600/40"
    : "from-indigo-600 to-blue-600 shadow-indigo-600/25 hover:shadow-indigo-600/40"}
  <div class="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-8">
    <div class="flex items-center gap-2 mb-6">
      <div class={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${badge}`}>
        {#if color === "emerald"}<Cpu size={14} />{:else}<Globe size={14} />{/if}
        {title}
      </div>
    </div>

    {#if isLoading && !loc}
      <div class="flex flex-col items-center py-6">
        <Loader class={`${loaderColor} animate-spin mb-3`} size={24} />
        <p class="text-slate-400 text-xs">Fetching location...</p>
      </div>
    {:else}
      {#if error && !loc}
        <div class="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-3 mb-4">
          <span class="text-rose-500 mt-0.5 shrink-0"><MapPin size={14} /></span>
          <p class="text-rose-600 text-xs">{error}</p>
        </div>
      {/if}
      {#if loc}{@render locationGrid(loc)}{/if}
    {/if}

    {#if !isLoading}
      <button
        class={`w-full group bg-linear-to-r ${btnGradient} text-white px-8 py-3.5 rounded-xl font-semibold text-sm shadow-lg transition-all duration-300 hover:scale-[1.02] inline-flex items-center justify-center gap-2 mt-4`}
        onclick={onView}
        type="button"
      >
        <MapPin size={16} />
        View Location
      </button>
    {/if}
  </div>
{/snippet}

<div class="min-h-full p-6 md:p-10 lg:p-14 flex items-center justify-center">
  <div class="max-w-4xl w-full">
    <div class="text-center mb-10">
      <div class="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full text-emerald-600 text-xs font-medium mb-4">
        <Compass size={14} />
        Location Services
      </div>
      <h1 class="text-3xl font-bold text-slate-800">Your Location</h1>
      <p class="text-slate-400 text-sm mt-2">View and manage your current location data</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      {@render locationCard("WITH SDK", "emerald", location, loadLocation, sdkError, onViewSdkLocation)}
      {@render locationCard("WITHOUT SDK", "indigo", browserLocation, loadBrowserLocation, browserError || "", onViewBrowserLocation)}
    </div>
  </div>
</div>
