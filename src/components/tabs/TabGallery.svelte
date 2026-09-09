<script lang="ts">
  import { FileImage, FolderOpen, HardDrive, Image, Loader, Upload, X } from "@lucide/svelte";
  import type { SdkFileModule } from "../../lib/types.ts";

  let {
    gallery,
    galleryLoading,
    galleryError,
    onOpenGallery,
    webImages,
    webImagesLoading,
    webImagesError,
    onUploadWebImages,
    title = "Gallery",
    subtitle = "Browse your captured images",
  }: {
    gallery: SdkFileModule[] | null;
    galleryLoading: boolean;
    galleryError: string | null;
    onOpenGallery: () => void;
    webImages: SdkFileModule[] | null;
    webImagesLoading: boolean;
    webImagesError: string | null;
    onUploadWebImages: () => void;
    title?: string;
    subtitle?: string;
  } = $props();

  function formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
</script>

{#snippet imagePreview(file: SdkFileModule)}
  {@const previewUrl = file.previewUrl || file.url}
  {@const ext = file.extension || file.fileName?.split(".").pop()?.toLowerCase() || "?"}
  <div class="bg-slate-50 rounded-xl border border-slate-100 overflow-hidden">
    <div class="aspect-square bg-slate-200 flex items-center justify-center overflow-hidden">
      <img alt={file.fileName} class="w-full h-full object-cover" src={previewUrl} />
    </div>
    <div class="p-3 space-y-1.5">
      <p class="text-[10px] font-medium text-slate-700 truncate leading-tight" title={file.fileName}>
        {file.fileName}
      </p>
      <div class="flex items-center gap-2 text-[10px] text-slate-400">
        <span class="inline-flex items-center gap-0.5"><FileImage size={10} />{ext.toUpperCase()}</span>
        <span class="inline-flex items-center gap-0.5"><HardDrive size={10} />{formatBytes(file.byteSize ?? 0)}</span>
      </div>
      {#if file.mimeType}
        <p class="text-[9px] text-slate-300 truncate">{file.mimeType}</p>
      {/if}
    </div>
  </div>
{/snippet}

{#snippet imageCard(cardTitle: string, color: "violet" | "rose", images: SdkFileModule[] | null, isLoading: boolean, error: string | null, onAction: () => void, actionLabel: string)}
  {@const badge = color === "violet"
    ? "bg-violet-50 border-violet-100 text-violet-600"
    : "bg-rose-50 border-rose-100 text-rose-600"}
  {@const loaderColor = color === "violet" ? "text-violet-500" : "text-rose-500"}
  {@const btnGradient = color === "violet"
    ? "from-violet-600 to-purple-600 shadow-violet-600/25 hover:shadow-violet-600/40"
    : "from-rose-600 to-pink-600 shadow-rose-600/25 hover:shadow-rose-600/40"}
  <div class="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6">
    <div class="flex items-center gap-2 mb-6">
      <div class={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${badge}`}>
        {#if color === "violet"}<FolderOpen size={14} />{:else}<Upload size={14} />{/if}
        {cardTitle}
      </div>
    </div>

    {#if isLoading && !images}
      <div class="flex flex-col items-center py-6">
        <Loader class={`${loaderColor} animate-spin mb-3`} size={24} />
        <p class="text-slate-400 text-xs">Loading...</p>
      </div>
    {:else}
      {#if error && !images}
        <div class="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-3 mb-4">
          <span class="text-rose-500 mt-0.5 shrink-0"><X size={14} /></span>
          <p class="text-rose-600 text-xs">{error}</p>
        </div>
      {/if}
      {#if images && images.length > 0}
        <div class="space-y-4 mb-4">
          <div class="grid grid-cols-2 gap-3">
            {#each images as file (file.url)}
              {@render imagePreview(file)}
            {/each}
          </div>
          <p class="text-slate-400 text-xs text-center">
            {images.length} image{images.length !== 1 ? "s" : ""} selected
          </p>
        </div>
      {/if}
    {/if}

    {#if !isLoading}
      <button
        class={`w-full group bg-linear-to-r ${btnGradient} text-white px-8 py-3.5 rounded-xl font-semibold text-sm shadow-lg transition-all duration-300 hover:scale-[1.02] inline-flex items-center justify-center gap-2`}
        onclick={onAction}
        type="button"
      >
        {#if color === "violet"}<FolderOpen size={16} />{:else}<Upload size={16} />{/if}
        {actionLabel}
      </button>
    {/if}
  </div>
{/snippet}

<div class="min-h-full p-6 md:p-10 lg:p-14">
  <div class="max-w-4xl mx-auto">
    <div class="text-center mb-10">
      <div class="inline-flex items-center gap-2 px-3 py-1.5 bg-violet-50 border border-violet-100 rounded-full text-violet-600 text-xs font-medium mb-4">
        <Image size={14} />
        Gallery
      </div>
      <h1 class="text-3xl font-bold text-slate-800">{title}</h1>
      <p class="text-slate-400 text-sm mt-2">{subtitle}</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      {@render imageCard("WITH SDK", "violet", gallery, galleryLoading, galleryError, onOpenGallery, "Open Gallery")}
      {@render imageCard("WITHOUT SDK", "rose", webImages, webImagesLoading, webImagesError, onUploadWebImages, "Upload Images")}
    </div>
  </div>
</div>
