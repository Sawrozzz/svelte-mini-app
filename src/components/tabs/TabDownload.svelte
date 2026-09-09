<script lang="ts">
  import { Check, Download, ExternalLink, FileText, Image, Loader, Save, X } from "@lucide/svelte";
  import type { SdkDeviceDownloadResult } from "../../lib/types.ts";

  let {
    imageDownload,
    imageLoading,
    imageError,
    onDownloadImage,
    imageDownloadWeb,
    imageLoadingWeb,
    imageErrorWeb,
    onDownloadImageWeb,
    fileDownload,
    fileLoading,
    fileError,
    onDownloadFile,
    fileDownloadWeb,
    fileLoadingWeb,
    fileErrorWeb,
    onDownloadFileWeb,
  }: {
    imageDownload: SdkDeviceDownloadResult | null;
    imageLoading: boolean;
    imageError: string | null;
    onDownloadImage: () => void;
    imageDownloadWeb: boolean;
    imageLoadingWeb: boolean;
    imageErrorWeb: string | null;
    onDownloadImageWeb: () => void;
    fileDownload: SdkDeviceDownloadResult | null;
    fileLoading: boolean;
    fileError: string | null;
    onDownloadFile: () => void;
    fileDownloadWeb: boolean;
    fileLoadingWeb: boolean;
    fileErrorWeb: string | null;
    onDownloadFileWeb: () => void;
  } = $props();
</script>

{#snippet downloadCard(title: string, download: SdkDeviceDownloadResult | null, isLoading: boolean, error: string | null, onAction: () => void, actionLabel: string)}
  <div class="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6">
    <div class="flex items-center gap-2 mb-6">
      <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-blue-50 border-blue-100 text-blue-600">
        <Download size={14} />
        {title}
      </div>
    </div>

    {#if isLoading && !download}
      <div class="flex flex-col items-center py-6">
        <Loader class="text-blue-500 animate-spin mb-3" size={24} />
        <p class="text-slate-400 text-xs">Downloading...</p>
      </div>
    {:else}
      {#if error && !download}
        <div class="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-3 mb-4">
          <span class="text-rose-500 mt-0.5 shrink-0"><X size={14} /></span>
          <p class="text-rose-600 text-xs">{error}</p>
        </div>
      {/if}
      {#if download}
        <div class="space-y-4 mb-4">
          <div class="grid grid-cols-3 gap-2">
            <div class="bg-slate-50 rounded-xl p-3 border border-slate-100">
              <p class="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-0.5">File</p>
              <p class="text-slate-700 font-semibold text-xs truncate">{download.file.fileName || "—"}</p>
            </div>
            <div class="bg-slate-50 rounded-xl p-3 border border-slate-100">
              <p class="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-0.5">Type</p>
              <p class="text-slate-700 font-semibold text-xs truncate">{download.file.mimeType || "—"}</p>
            </div>
            <div class="bg-slate-50 rounded-xl p-3 border border-slate-100">
              <p class="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-0.5">Size</p>
              <p class="text-slate-700 font-semibold text-xs">
                {download.file.byteSize ? `${(download.file.byteSize / 1024).toFixed(1)} KB` : "—"}
              </p>
            </div>
          </div>
          {#if download.file.url}
            <div class="flex justify-center">
              <a
                class="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 hover:underline"
                href={download.file.url}
                rel="noopener noreferrer"
                target="_blank"
              >
                <ExternalLink size={14} />
                Open downloaded file
              </a>
            </div>
          {/if}
        </div>
      {/if}
    {/if}

    {#if !isLoading}
      <button
        class="w-full group bg-linear-to-r from-blue-600 to-indigo-600 shadow-blue-600/25 hover:shadow-blue-600/40 text-white px-8 py-3.5 rounded-xl font-semibold text-sm shadow-lg transition-all duration-300 hover:scale-[1.02] inline-flex items-center justify-center gap-2"
        onclick={onAction}
        type="button"
      >
        <Download size={16} />
        {download ? "Download Again" : actionLabel}
      </button>
    {/if}
  </div>
{/snippet}

{#snippet browserDownloadCard(title: string, downloaded: boolean, isLoading: boolean, error: string | null, onAction: () => void, actionLabel: string, fileName: string)}
  <div class="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6">
    <div class="flex items-center gap-2 mb-6">
      <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-green-50 border-green-100 text-green-600">
        <Save size={14} />
        {title}
      </div>
    </div>

    {#if isLoading}
      <div class="flex flex-col items-center py-6">
        <Loader class="text-green-500 animate-spin mb-3" size={24} />
        <p class="text-slate-400 text-xs">Downloading...</p>
      </div>
    {:else}
      {#if error}
        <div class="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-3 mb-4">
          <span class="text-rose-500 mt-0.5 shrink-0"><X size={14} /></span>
          <p class="text-rose-600 text-xs">{error}</p>
        </div>
      {/if}
      {#if downloaded}
        <div class="space-y-4 mb-4">
          <div class="flex items-center justify-center py-4">
            <div class="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <Check class="text-green-600" size={24} />
            </div>
          </div>
          <div class="bg-slate-50 rounded-xl p-3 border border-slate-100">
            <p class="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-0.5">File</p>
            <p class="text-slate-700 font-semibold text-xs truncate">{fileName}</p>
          </div>
          <p class="text-slate-400 text-xs text-center">Download completed successfully</p>
        </div>
      {/if}
    {/if}

    {#if !isLoading}
      <button
        class="w-full group bg-linear-to-r from-green-600 to-emerald-600 shadow-green-600/25 hover:shadow-green-600/40 text-white px-8 py-3.5 rounded-xl font-semibold text-sm shadow-lg transition-all duration-300 hover:scale-[1.02] inline-flex items-center justify-center gap-2"
        onclick={onAction}
        type="button"
      >
        <Save size={16} />
        {actionLabel}
      </button>
    {/if}
  </div>
{/snippet}

<div class="min-h-full p-6 md:p-10 lg:p-14">
  <div class="max-w-4xl mx-auto">
    <div class="text-center mb-10">
      <div class="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-full text-blue-600 text-xs font-medium mb-4">
        <Download size={14} />
        Download Feature
      </div>
      <h1 class="text-3xl font-bold text-slate-800">Download</h1>
      <p class="text-slate-400 text-sm mt-2">Download files and preview them instantly</p>
    </div>

    <div class="space-y-8">
      <div>
        <div class="flex items-center gap-2 mb-4">
          <Image class="text-slate-600" size={16} />
          <h2 class="text-lg font-semibold text-slate-800">Image Download</h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          {@render downloadCard("WITH SDK", imageDownload, imageLoading, imageError, onDownloadImage, "Download Image")}
          {@render browserDownloadCard("WITHOUT SDK", imageDownloadWeb, imageLoadingWeb, imageErrorWeb, onDownloadImageWeb, "Download Image", "sample-image.jpg")}
        </div>
      </div>

      <div>
        <div class="flex items-center gap-2 mb-4">
          <FileText class="text-slate-600" size={16} />
          <h2 class="text-lg font-semibold text-slate-800">File Download</h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          {@render downloadCard("WITH SDK", fileDownload, fileLoading, fileError, onDownloadFile, "Download File")}
          {@render browserDownloadCard("WITHOUT SDK", fileDownloadWeb, fileLoadingWeb, fileErrorWeb, onDownloadFileWeb, "Download File", "sample.pdf")}
        </div>
      </div>
    </div>
  </div>
</div>
