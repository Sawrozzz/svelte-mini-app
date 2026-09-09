<script lang="ts">
  import {
    FileArchive,
    FileCode,
    FileImage,
    FileSpreadsheet,
    FileText,
    Film,
    Folder,
    HardDrive,
    Loader,
    Upload,
    X,
  } from "@lucide/svelte";
  import type { SdkFileModule } from "../../lib/types.ts";

  let {
    documents,
    documentsLoading,
    documentsError,
    onOpenFilePicker,
    webDocuments,
    webDocumentsLoading,
    webDocumentsError,
    onUploadWebFiles,
  }: {
    documents: SdkFileModule[] | null;
    documentsLoading: boolean;
    documentsError: string | null;
    onOpenFilePicker: () => void;
    webDocuments: SdkFileModule[] | null;
    webDocumentsLoading: boolean;
    webDocumentsError: string | null;
    onUploadWebFiles: () => void;
  } = $props();

  function formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  function getFileIcon(ext: string) {
    const imageExts = ["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp", "ico"];
    const videoExts = ["mp4", "webm", "avi", "mov", "mkv", "flv"];
    const archiveExts = ["zip", "rar", "7z", "tar", "gz", "bz2"];
    const codeExts = ["js", "ts", "jsx", "tsx", "json", "html", "css", "py", "java", "cpp", "c", "go", "rs"];
    if (imageExts.includes(ext)) return FileImage;
    if (videoExts.includes(ext)) return Film;
    if (archiveExts.includes(ext)) return FileArchive;
    if (codeExts.includes(ext)) return FileCode;
    if (ext === "pdf" || ext === "doc" || ext === "docx" || ext === "xls" || ext === "xlsx")
      return FileSpreadsheet;
    return FileText;
  }
</script>

{#snippet filePreview(file: SdkFileModule)}
  {@const ext = file.extension || file.fileName?.split(".").pop()?.toLowerCase() || "?"}
  {@const isImage = file.mimeType?.startsWith("image/")}
  {@const Icon = getFileIcon(ext)}
  <div class="bg-slate-50 rounded-xl border border-slate-100 p-3 flex items-center gap-3">
    {#if isImage && (file.previewUrl || file.url)}
      <div class="w-12 h-12 rounded-lg bg-slate-200 overflow-hidden shrink-0">
        <img alt={file.fileName} class="w-full h-full object-cover" src={file.previewUrl || file.url} />
      </div>
    {:else}
      <div class="w-12 h-12 rounded-lg bg-slate-200 flex items-center justify-center shrink-0">
        <Icon class="text-slate-500" size={22} />
      </div>
    {/if}
    <div class="min-w-0 flex-1">
      <p class="text-xs font-medium text-slate-700 truncate" title={file.fileName}>{file.fileName}</p>
      <div class="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
        <span class="inline-flex items-center gap-0.5"><FileText size={9} />{ext.toUpperCase()}</span>
        <span class="inline-flex items-center gap-0.5"><HardDrive size={9} />{formatBytes(file.byteSize ?? 0)}</span>
      </div>
    </div>
  </div>
{/snippet}

{#snippet fileCard(title: string, color: "cyan" | "amber", files: SdkFileModule[] | null, isLoading: boolean, error: string | null, onAction: () => void, actionLabel: string)}
  {@const badge = color === "cyan"
    ? "bg-cyan-50 border-cyan-100 text-cyan-600"
    : "bg-amber-50 border-amber-100 text-amber-600"}
  {@const loaderColor = color === "cyan" ? "text-cyan-500" : "text-amber-500"}
  {@const btnGradient = color === "cyan"
    ? "from-cyan-600 to-teal-600 shadow-cyan-600/25 hover:shadow-cyan-600/40"
    : "from-amber-600 to-orange-600 shadow-amber-600/25 hover:shadow-amber-600/40"}
  <div class="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6">
    <div class="flex items-center gap-2 mb-6">
      <div class={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${badge}`}>
        {#if color === "cyan"}<Folder size={14} />{:else}<Upload size={14} />{/if}
        {title}
      </div>
    </div>

    {#if isLoading && !files}
      <div class="flex flex-col items-center py-6">
        <Loader class={`${loaderColor} animate-spin mb-3`} size={24} />
        <p class="text-slate-400 text-xs">Loading...</p>
      </div>
    {:else}
      {#if error && !files}
        <div class="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-3 mb-4">
          <span class="text-rose-500 mt-0.5 shrink-0"><X size={14} /></span>
          <p class="text-rose-600 text-xs">{error}</p>
        </div>
      {/if}
      {#if files && files.length > 0}
        <div class="space-y-4 mb-4">
          <div class="space-y-2">
            {#each files as file (file.url)}
              {@render filePreview(file)}
            {/each}
          </div>
          <p class="text-slate-400 text-xs text-center">
            {files.length} file{files.length !== 1 ? "s" : ""} selected
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
        {#if color === "cyan"}<Folder size={16} />{:else}<Upload size={16} />{/if}
        {actionLabel}
      </button>
    {/if}
  </div>
{/snippet}

<div class="min-h-full p-6 md:p-10 lg:p-14">
  <div class="max-w-4xl mx-auto">
    <div class="text-center mb-10">
      <div class="inline-flex items-center gap-2 px-3 py-1.5 bg-cyan-50 border border-cyan-100 rounded-full text-cyan-600 text-xs font-medium mb-4">
        <Folder size={14} />
        Files
      </div>
      <h1 class="text-3xl font-bold text-slate-800">Files</h1>
      <p class="text-slate-400 text-sm mt-2">Manage your documents and files</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      {@render fileCard("WITH SDK", "cyan", documents, documentsLoading, documentsError, onOpenFilePicker, "Open File Picker")}
      {@render fileCard("WITHOUT SDK", "amber", webDocuments, webDocumentsLoading, webDocumentsError, onUploadWebFiles, "Upload Files")}
    </div>
  </div>
</div>
