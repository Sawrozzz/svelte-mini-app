<script lang="ts">
  let {
    message = "Failed to load the application.",
  }: { message?: string } = $props();
</script>

<div class="flex min-h-screen items-center justify-center bg-gray-50 px-6">
  <div
    class="max-w-md rounded-xl border border-gray-200 bg-white p-8 text-center shadow-lg"
  >
    <div class="mb-4 text-5xl">⚠️</div>

    <h1 class="mb-2 text-2xl font-semibold text-gray-900">Failed to Load</h1>

    <p class="mb-6 text-sm text-gray-600">{message}</p>

    <button
      onclick={() => window.location.reload()}
      class="rounded-lg bg-indigo-600 px-4 py-2 text-white transition hover:bg-indigo-700"
    >
      Retry
    </button>
  </div>
</div>
