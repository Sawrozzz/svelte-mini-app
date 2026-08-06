<script lang="ts">
  import type { Snippet } from "svelte";
  import { useT } from "../../hooks/useT.svelte";

  let {
    isDark,
    error = null,
    result = undefined,
    sample,
    children,
  }: {
    isDark: boolean;
    /** Message shown when the SDK call failed or the permission was refused. */
    error?: string | null;
    /** Raw payload returned by the SDK, rendered as JSON once available. */
    result?: unknown;
    /** Static example rendered until a real response arrives. */
    sample: string;
    children?: Snippet;
  } = $props();

  const { t } = useT();

  /** `rawFile` is a `File` instance that serialises to `{}` — drop it from the view. */
  function stringify(value: unknown): string {
    return JSON.stringify(
      value,
      (key, val) => (key === "rawFile" ? undefined : val),
      2,
    );
  }

  const hasResult = $derived(result !== null && result !== undefined);
</script>

<div
  class={`rounded-3xl p-8 ${
    isDark
      ? "bg-gray-900 border border-gray-800"
      : "bg-white border border-gray-100"
  }`}
>
  <h2
    class={`text-xl font-semibold ${isDark ? "text-white" : "text-gray-900"}`}
  >
    {hasResult ? t("common.response") : t("common.sampleResponse")}
  </h2>

  {#if error}
    <div
      class={`mt-4 flex items-start gap-3 rounded-xl p-4 text-sm ${
        isDark
          ? "bg-red-950/40 border border-red-900/50 text-red-300"
          : "bg-red-50 border border-red-200 text-red-700"
      }`}
    >
      <span class="text-lg leading-none">⚠️</span>
      <span>{error}</span>
    </div>
  {/if}

  {#if children}
    <div class="mt-4">{@render children()}</div>
  {/if}

  <pre
    class={`mt-4 rounded-xl p-4 overflow-x-auto text-sm ${
      isDark
        ? "bg-gray-950 border border-gray-800 text-gray-300"
        : "bg-gray-50 border border-gray-200 text-gray-700"
    }`}>{hasResult ? stringify(result) : sample}</pre>
</div>
