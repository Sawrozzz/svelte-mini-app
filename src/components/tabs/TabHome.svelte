<script lang="ts">
  import { ArrowRight, Camera, FileText, MapPin, MessageCircle, Sparkles, Zap } from "@lucide/svelte";
  import { tStore } from "../../lib/i18n.ts";
  import { goTo } from "../../router/navigation.ts";

  const features = [
    { icon: FileText, key: "testApi", gradient: "from-blue-500 to-cyan-500", path: "/test-api" },
    { icon: MessageCircle, key: "chat", gradient: "from-purple-500 to-pink-500", path: "/chat" },
    { icon: MapPin, key: "location", gradient: "from-emerald-500 to-teal-500", path: "/location" },
    { icon: Camera, key: "camera", gradient: "from-amber-500 to-orange-500", path: "/camera" },
  ];
</script>

<div class="min-h-full p-6 md:p-10 lg:p-14">
  <div class="max-w-5xl mx-auto">
    <div class="flex flex-col lg:flex-row items-center gap-10 mb-16">
      <div class="flex-1 w-full max-w-md mx-auto lg:mx-0">
        <div class="relative">
          <div class="absolute inset-0 bg-linear-to-br from-blue-400/20 via-purple-400/10 to-pink-400/20 rounded-full blur-3xl"></div>
          <div class="relative flex items-center justify-center">
            <div class="w-56 h-56 md:w-64 md:h-64 bg-linear-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-3xl rotate-12 shadow-2xl shadow-blue-500/20 flex items-center justify-center">
              <Sparkles class="text-white/80" size={72} />
            </div>
            <div class="absolute -top-3 -right-3 w-20 h-20 bg-linear-to-br from-amber-400 to-orange-500 rounded-2xl -rotate-12 shadow-lg shadow-amber-500/30 flex items-center justify-center">
              <Zap class="text-white" size={32} />
            </div>
            <div class="absolute -bottom-3 -left-3 w-16 h-16 bg-linear-to-br from-emerald-400 to-teal-500 rounded-2xl rotate-6 shadow-lg shadow-emerald-500/30 flex items-center justify-center">
              <span class="text-2xl">✨</span>
            </div>
          </div>
        </div>
      </div>

      <div class="flex-1 text-center lg:text-left">
        <div class="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-full text-blue-600 text-xs font-medium mb-5">
          <Sparkles size={14} />
          {$tStore("home.badge")}
        </div>
        <h1 class="text-4xl md:text-5xl font-extrabold text-slate-800 leading-tight mb-4">
          {$tStore("home.heroTitle")}
        </h1>
        <p class="text-slate-500 text-lg leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0">
          {$tStore("home.heroSubtitle")}
        </p>
        <button
          class="group bg-linear-to-r from-blue-600 to-purple-600 text-white px-8 py-3.5 rounded-xl font-semibold text-sm shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 transition-all duration-300 hover:scale-[1.02] inline-flex items-center gap-2"
          onclick={() => void goTo("/test-api")}
          type="button"
        >
          {$tStore("home.getStarted")}
          <ArrowRight class="group-hover:translate-x-1 transition-transform" size={16} />
        </button>
      </div>
    </div>

    <div class="text-center mb-8">
      <h2 class="text-2xl font-bold text-slate-800">{$tStore("home.exploreTitle")}</h2>
      <p class="text-slate-400 text-sm mt-1">{$tStore("home.exploreSubtitle")}</p>
    </div>

    <div class="grid sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
      {#each features as { icon: Icon, key, gradient, path } (path)}
        <button
          class="group relative bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:shadow-slate-200/80 transition-all duration-300 text-left hover:-translate-y-1"
          onclick={() => void goTo(path)}
          type="button"
        >
          <div class={`w-12 h-12 bg-linear-to-br ${gradient} rounded-xl flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 group-hover:shadow-md transition-all duration-300`}>
            <Icon class="text-white" size={22} />
          </div>
          <h3 class="text-slate-800 font-semibold mb-1 group-hover:text-blue-600 transition-colors">
            {$tStore(`feature.${key}`)}
          </h3>
          <p class="text-slate-400 text-sm">{$tStore(`feature.${key}Desc`)}</p>
        </button>
      {/each}
    </div>
  </div>
</div>
