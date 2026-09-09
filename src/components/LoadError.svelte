<script lang="ts">
  let {
    message = "Failed to load the application.",
    details,
  }: {
    message?: string;
    details?: {
      message: string;
      functionName?: string;
      file?: string;
      line?: number;
      column?: number;
      stack?: string;
    };
  } = $props();

  let showDetails = $state(false);
</script>

<div class="flex min-h-screen items-center justify-center bg-gray-50 px-6 py-8">
  <div class="max-w-lg rounded-xl border border-gray-200 bg-white p-8 text-center shadow-lg">
    <div class="mb-4 text-5xl">⚠️</div>
    <h1 class="mb-2 text-2xl font-semibold text-gray-900">Failed to Load</h1>
    <p class="mb-6 text-sm text-gray-600">{details?.message ?? message}</p>

    {#if details}
      <div class="mb-6 text-left">
        <button
          class="mb-3 text-xs font-medium text-indigo-600 hover:text-indigo-700"
          onclick={() => (showDetails = !showDetails)}
          type="button"
        >
          {showDetails ? "Hide details" : "Show details"} ▾
        </button>

        {#if showDetails}
          <div class="rounded-lg border border-gray-200 bg-gray-50 p-4 text-left text-xs text-gray-700">
            <dl class="mb-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5">
              {#if details.functionName}
                <dt class="font-medium text-gray-500">Function</dt>
                <dd class="break-all font-mono">{details.functionName}</dd>
              {/if}
              {#if details.file}
                <dt class="font-medium text-gray-500">File</dt>
                <dd class="break-all font-mono">{details.file}</dd>
              {/if}
              {#if details.line != null}
                <dt class="font-medium text-gray-500">Location</dt>
                <dd class="font-mono">
                  line {details.line}{details.column != null ? `:${details.column}` : ""}
                </dd>
              {/if}
            </dl>
            {#if details.stack}
              <pre class="max-h-48 overflow-auto whitespace-pre-wrap rounded bg-white p-3 font-mono text-[10px] leading-relaxed text-gray-600">{details.stack}</pre>
            {/if}
          </div>
        {/if}
      </div>
    {/if}

    <button
      class="rounded-lg bg-indigo-600 px-4 py-2 text-white transition hover:bg-indigo-700"
      onclick={() => window.location.reload()}
      type="button"
    >
      Retry
    </button>
  </div>
</div>
