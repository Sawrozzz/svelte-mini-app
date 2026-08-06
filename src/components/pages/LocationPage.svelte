<script lang="ts">
  import { useT } from "../../hooks/useT.svelte";
  import { usePlatformSDK } from "../../hooks/usePlatformSDK";
  import { permissionErrorMessage } from "../../utils/permission";
  import ResultPanel from "./Result.svelte";
  import type { FeaturePageProps } from "../../types";

  const SAMPLE = `{
  "latitude": 6.9271,
  "longitude": 79.8612,
  "accuracy": 15.5,
  "timestamp": 2026-02-05
}`;

  let { isDark }: FeaturePageProps = $props();

  const { t } = useT();
  const platform = usePlatformSDK();

  let location = $state<SdkDeviceLocationResult | null>(null);
  let loading = $state(false);
  let error = $state<string | null>(null);

  function osmEmbedUrl(latitude: number, longitude: number, delta = 0.004) {
    const bbox = [
      longitude - delta,
      latitude - delta,
      longitude + delta,
      latitude + delta,
    ].join(",");
    return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${latitude},${longitude}`;
  }

  async function handleViewSdkLocation() {
    const sdk = platform.sdk;
    if (!sdk) return;

    loading = true;
    error = null;
    location = null;

    try {
      const res = await sdk.device.location({
        reason: "To view your current location",
      });
      const denial = permissionErrorMessage(res.status, "Location");
      if (denial) {
        error = denial;
        return;
      }
      location = res.data ?? null;
    } catch (err) {
      error =
        err instanceof Error ? err.message : "Failed to get location via SDK.";
    } finally {
      loading = false;
    }
  }
</script>

<div
  class={`min-h-screen p-6 transition-colors ${
    isDark ? "bg-gray-950" : "bg-gray-50"
  }`}
>
  <div class="mx-auto max-w-4xl space-y-8">
    <div class="space-y-4 text-center">
      <div
        class={`mx-auto flex h-24 w-24 items-center justify-center rounded-3xl ${
          isDark ? "bg-blue-900/30" : "bg-blue-100"
        }`}
      >
        <span class="text-6xl">📍</span>
      </div>
      <div>
        <h1
          class={`text-4xl font-bold tracking-tight ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          {t("feature.location.title")}
        </h1>
        <p
          class={`mt-2 text-lg ${isDark ? "text-gray-400" : "text-gray-600"}`}
        >
          {t("feature.location.desc")}
        </p>
      </div>
    </div>

    <div
      class={`rounded-3xl p-8 ${
        isDark
          ? "bg-gray-900 border border-gray-800"
          : "bg-white border border-gray-100"
      }`}
    >
      <div class="space-y-6">
        <div class="grid gap-6 md:grid-cols-2">
          <div
            class={`rounded-2xl p-6 ${isDark ? "bg-gray-800/50" : "bg-gray-50"}`}
          >
            <div class="flex items-center gap-3">
              <div
                class={`flex h-10 w-10 items-center justify-center rounded-lg ${
                  isDark ? "bg-blue-900/30" : "bg-blue-100"
                }`}
              >
                <span class="text-2xl">🎯</span>
              </div>
              <div>
                <h3
                  class={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}
                >
                  Current Location
                </h3>
                <p
                  class={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
                >
                  Get precise GPS coordinates
                </p>
              </div>
            </div>
          </div>
          <div
            class={`rounded-2xl p-6 ${isDark ? "bg-gray-800/50" : "bg-gray-50"}`}
          >
            <div class="flex items-center gap-3">
              <div
                class={`flex h-10 w-10 items-center justify-center rounded-lg ${
                  isDark ? "bg-green-900/30" : "bg-green-100"
                }`}
              >
                <span class="text-2xl">🗺️</span>
              </div>
              <div>
                <h3
                  class={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}
                >
                  Reverse Geocoding
                </h3>
                <p
                  class={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
                >
                  Convert coords to address
                </p>
              </div>
            </div>
          </div>
        </div>

        <div
          class={`rounded-2xl p-6 ${isDark ? "bg-blue-900/20" : "bg-blue-50"} border ${
            isDark ? "border-blue-900/30" : "border-blue-100"
          }`}
        >
          <div class="flex items-start gap-4">
            <div
              class={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                isDark ? "bg-blue-900/30" : "bg-blue-100"
              }`}
            >
              <span class="text-3xl">ℹ️</span>
            </div>
            <div class="flex-1">
              <h4
                class={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}
              >
                How it works
              </h4>
              <p
                class={`mt-1 text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
              >
                This feature calls <code>sdk.device.location()</code>, which asks
                the host app for a high-accuracy fix and returns latitude,
                longitude, accuracy and a timestamp.
              </p>
            </div>
          </div>
        </div>

        <div class="pt-4">
          <button
            onclick={handleViewSdkLocation}
            disabled={loading}
            class={`w-full rounded-xl bg-blue-600 px-6 py-4 text-lg font-semibold text-white transition hover:bg-blue-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 ${
              isDark ? "shadow-lg shadow-blue-600/30" : "shadow-lg shadow-blue-600/25"
            }`}
          >
            {loading ? t("common.loading") : t("feature.location.action")}
          </button>
        </div>
      </div>
    </div>

    <ResultPanel {isDark} {error} result={location} sample={SAMPLE}>
      {#if location}
        {@const loc = location}
        <div class="space-y-4">
          <div
            class={`overflow-hidden rounded-2xl border ${
              isDark ? "border-gray-800" : "border-gray-200"
            }`}
          >
            <iframe
              title={t("feature.location.title")}
              class="h-72 w-full border-0"
              src={osmEmbedUrl(loc.latitude, loc.longitude)}
            ></iframe>
            <div
              class={`flex items-center justify-between gap-3 px-4 py-3 ${
                isDark ? "bg-gray-800/50" : "bg-gray-50"
              }`}
            >
              <span class="truncate text-xs text-gray-500">
                Latitude: {loc.latitude.toFixed(5)}, Longitude: {loc.longitude.toFixed(
                  5,
                )}
              </span>
              <a
                class="shrink-0 text-xs font-medium text-blue-600 hover:underline"
                href={`https://www.openstreetmap.org/?mlat=${loc.latitude}&mlon=${loc.longitude}#map=16/${loc.latitude}/${loc.longitude}`}
                target="_blank"
                rel="noreferrer"
              >
                {t("common.viewLargerMap")}
              </a>
            </div>
          </div>

          <div class="grid gap-4 sm:grid-cols-3">
            {#each [{ label: "Latitude", value: loc.latitude }, { label: "Longitude", value: loc.longitude }, { label: "Accuracy", value: loc.accuracy ?? "—" }] as item (item.label)}
              <div
                class={`rounded-2xl p-4 ${isDark ? "bg-gray-800/50" : "bg-gray-50"}`}
              >
                <p class="text-xs uppercase tracking-wide text-gray-500">
                  {item.label}
                </p>
                <p
                  class={`mt-1 font-semibold ${isDark ? "text-white" : "text-gray-900"}`}
                >
                  {String(item.value)}
                </p>
              </div>
            {/each}
          </div>
        </div>
      {/if}
    </ResultPanel>

    <div
      class={`rounded-3xl p-8 text-center ${
        isDark
          ? "bg-gray-900 border border-gray-800"
          : "bg-white border border-gray-100"
      }`}
    >
      <div
        class={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl ${
          isDark ? "bg-purple-900/30" : "bg-purple-100"
        }`}
      >
        <span class="text-4xl">⚡</span>
      </div>
      <h3
        class={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"}`}
      >
        Ready to test?
      </h3>
      <p class={`mt-1 text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
        Tap the button above to fetch your current location using the platform
        SDK.
      </p>
    </div>
  </div>
</div>
