<script lang="ts">
import { useT } from "../hooks/useT.svelte";
import { useAppearance } from "../hooks/useAppearance.svelte";
import { featurePages } from "./pages";
import type { Feature } from "../types";
import ImageGallery from "./ImageGallery.svelte";

  const featureBase = [{ id: "location", emoji: "📍" }];

  let { initialPath }: { initialPath?: string } = $props();

  const { t } = useT();
  const appearance = useAppearance();

  const isDark = $derived(appearance.theme.mode === "dark");

  const features = $derived<Feature[]>(
    featureBase.map((f) => ({
      id: f.id,
      emoji: f.emoji,
      title: t(`feature.${f.id}.title`),
      description: t(`feature.${f.id}.desc`),
    })),
  );

  let activeId = $state<string | null>(null);

  const activeCard = $derived(
    activeId ? (features.find((f) => f.id === activeId) ?? null) : null,
  );

  function handleCardChange(cardId: string) {
    window.location.hash = cardId;
  }

  function updateFromHash() {
    activeId = window.location.hash.replace("#", "") || null;
  }

  $effect(() => {
    // The host can deep-link straight into a feature on first mount.
    if (initialPath && !window.location.hash) {
      window.location.hash = initialPath.replace(/^[#/]+/, "");
    }

    updateFromHash();
    window.addEventListener("hashchange", updateFromHash);

    return () => window.removeEventListener("hashchange", updateFromHash);
  });
</script>

{#if activeCard}
  {@const Page = featurePages[activeCard.id]}
  <div
    class={`min-h-screen p-6 transition-colors ${
      isDark ? "bg-gray-950" : "bg-gray-50"
    }`}
  >
    <div class="mx-auto max-w-7xl">
      <button
        onclick={() => {
          window.location.hash = "";
          activeId = null;
        }}
        class={`mb-6 flex items-center cursor-pointer gap-2 text-sm font-medium transition ${
          isDark
            ? "text-gray-400 hover:text-white"
            : "text-gray-600 hover:text-gray-900"
        }`}
      >
        ← {t("common.back")}
      </button>

      {#if Page}
        <Page feature={activeCard} {isDark} />
      {/if}
    </div>
  </div>
{:else}
  <div
    class={`min-h-screen p-6 transition-colors ${
      isDark ? "bg-gray-950" : "bg-gray-50"
    }`}
  >
    <div class="mx-auto max-w-7xl">
      <div class="mb-8">
        <h1
          class={`text-3xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}
        >
          {t("app.title")}
        </h1>
        <p class={`mt-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
          {t("app.subtitle")}
        </p>
      </div>

      <div
        class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        {#each features as feature (feature.id)}
          <button
            onclick={() => handleCardChange(feature.id)}
            class={`group rounded-2xl border p-6 text-left shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-blue-500 hover:shadow-lg ${
              isDark
                ? "border-gray-800 bg-gray-900"
                : "border-gray-200 bg-white"
            }`}
          >
            <div
              class={`mb-4 flex h-14 w-14 items-center justify-center rounded-xl text-3xl transition-colors group-hover:bg-blue-500 ${
                isDark ? "bg-gray-800" : "bg-blue-100"
              }`}
            >
              <span class="group-hover:scale-110 transition-transform">
                {feature.emoji}
              </span>
            </div>

            <h2
              class={`text-lg font-semibold ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {feature.title}
            </h2>

            <p
              class={`mt-2 text-sm ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {feature.description}
            </p>

            <div class="mt-5 flex items-center text-sm font-medium text-blue-600">
              {t("common.test")}
              <span class="ml-2 transition-transform group-hover:translate-x-1">
                →
              </span>
            </div>
          </button>
        {/each}
      </div>

      <ImageGallery />
    </div>
  </div>
{/if}
