<script lang="ts">
  import { Camera, Image, Loader, X } from "@lucide/svelte";

  let {
    loadCamera,
    cameraResponse,
    cameraError,
    onOpenCamera,
    browserCamera,
    browserCameraLoading,
    browserCameraError,
    onOpenBrowserCamera,
  }: {
    loadCamera: boolean;
    cameraResponse: SdkDeviceCameraResult | null;
    cameraError: string | null;
    onOpenCamera: () => void;
    browserCamera: SdkDeviceCameraResult | null;
    browserCameraLoading: boolean;
    browserCameraError: string | null;
    onOpenBrowserCamera: () => void;
  } = $props();

  function imageSrcOf(camera: SdkDeviceCameraResult | null): string | null {
    if (!camera?.url) return null;
    if (
      camera.url.startsWith("data:") ||
      camera.url.startsWith("blob:") ||
      camera.url.startsWith("http://") ||
      camera.url.startsWith("https://")
    )
      return camera.url;
    return `data:${camera.mimeType};base64,${camera.url}`;
  }
</script>

{#snippet cameraCard(title: string, color: "amber" | "pink", camera: SdkDeviceCameraResult | null, isLoading: boolean, error: string | null, onAction: () => void, actionLabel: string)}
  {@const badge = color === "amber"
    ? "bg-amber-50 border-amber-100 text-amber-600"
    : "bg-pink-50 border-pink-100 text-pink-600"}
  {@const loaderColor = color === "amber" ? "text-amber-500" : "text-pink-500"}
  {@const btnGradient = color === "amber"
    ? "from-amber-600 to-orange-600 shadow-amber-600/25 hover:shadow-amber-600/40"
    : "from-pink-600 to-rose-600 shadow-pink-600/25 hover:shadow-pink-600/40"}
  {@const src = imageSrcOf(camera)}
  <div class="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6">
    <div class="flex items-center gap-2 mb-6">
      <div class={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${badge}`}>
        {#if color === "amber"}<Camera size={14} />{:else}<Image size={14} />{/if}
        {title}
      </div>
    </div>

    {#if isLoading && !camera}
      <div class="flex flex-col items-center py-6">
        <Loader class={`${loaderColor} animate-spin mb-3`} size={24} />
        <p class="text-slate-400 text-xs">Opening camera...</p>
      </div>
    {:else}
      {#if error && !camera}
        <div class="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-3 mb-4">
          <span class="text-rose-500 mt-0.5 shrink-0"><X size={14} /></span>
          <p class="text-rose-600 text-xs">{error}</p>
        </div>
      {/if}
      {#if camera && src}
        <div class="space-y-4 mb-4">
          <div class="rounded-2xl overflow-hidden border border-slate-100 bg-slate-50">
            <img alt={camera.fileName || "Camera preview"} class="w-full max-h-56 object-contain mx-auto" {src} />
          </div>
          <div class="grid grid-cols-3 gap-2">
            <div class="bg-slate-50 rounded-xl p-3 border border-slate-100">
              <p class="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-0.5">File</p>
              <p class="text-slate-700 font-semibold text-xs truncate">{camera.fileName || "—"}</p>
            </div>
            <div class="bg-slate-50 rounded-xl p-3 border border-slate-100">
              <p class="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-0.5">Type</p>
              <p class="text-slate-700 font-semibold text-xs truncate">{camera.mimeType || "—"}</p>
            </div>
            <div class="bg-slate-50 rounded-xl p-3 border border-slate-100">
              <p class="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-0.5">Size</p>
              <p class="text-slate-700 font-semibold text-xs">{((camera.byteSize ?? 0) / 1024).toFixed(1)} KB</p>
            </div>
          </div>
        </div>
      {/if}
    {/if}

    {#if !isLoading}
      <button
        class={`w-full group bg-linear-to-r ${btnGradient} text-white px-8 py-3.5 rounded-xl font-semibold text-sm shadow-lg transition-all duration-300 hover:scale-[1.02] inline-flex items-center justify-center gap-2`}
        onclick={onAction}
        type="button"
      >
        <Camera size={16} />
        {camera ? "Capture Again" : actionLabel}
      </button>
    {/if}
  </div>
{/snippet}

<div class="min-h-full p-6 md:p-10 lg:p-14">
  <div class="max-w-4xl mx-auto">
    <div class="text-center mb-10">
      <div class="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-100 rounded-full text-amber-600 text-xs font-medium mb-4">
        <Camera size={14} />
        Camera Feature
      </div>
      <h1 class="text-3xl font-bold text-slate-800">Camera</h1>
      <p class="text-slate-400 text-sm mt-2">Capture photos and preview them instantly</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      {@render cameraCard("WITH SDK", "amber", cameraResponse, loadCamera, cameraError, onOpenCamera, "Open Camera")}
      {@render cameraCard("WITHOUT SDK", "pink", browserCamera, browserCameraLoading, browserCameraError, onOpenBrowserCamera, "Capture Photo")}
    </div>
  </div>
</div>
