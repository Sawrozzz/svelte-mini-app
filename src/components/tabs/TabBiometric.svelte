<script lang="ts">
  import { Fingerprint, Loader, ShieldCheck, ShieldX, X } from "@lucide/svelte";
  import type { SdkDeviceBiometricResult } from "../../lib/types.ts";

  let {
    biometric,
    biometricLoading,
    biometricError,
    onAuthenticate,
    webBiometric,
    webBiometricLoading,
    webBiometricError,
    onAuthenticateWeb,
  }: {
    biometric: SdkDeviceBiometricResult | null;
    biometricLoading: boolean;
    biometricError: string | null;
    onAuthenticate: () => void;
    webBiometric: SdkDeviceBiometricResult | null;
    webBiometricLoading: boolean;
    webBiometricError: string | null;
    onAuthenticateWeb: () => void;
  } = $props();
</script>

{#snippet biometricCard(title: string, color: "emerald" | "sky", bio: SdkDeviceBiometricResult | null, isLoading: boolean, error: string | null, onAction: () => void, actionLabel: string)}
  {@const badge = color === "emerald"
    ? "bg-emerald-50 border-emerald-100 text-emerald-600"
    : "bg-sky-50 border-sky-100 text-sky-600"}
  {@const loaderColor = color === "emerald" ? "text-emerald-500" : "text-sky-500"}
  {@const btnGradient = color === "emerald"
    ? "from-emerald-600 to-teal-600 shadow-emerald-600/25 hover:shadow-emerald-600/40"
    : "from-sky-600 to-blue-600 shadow-sky-600/25 hover:shadow-sky-600/40"}
  <div class="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6">
    <div class="flex items-center gap-2 mb-6">
      <div class={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${badge}`}>
        {#if color === "emerald"}<Fingerprint size={14} />{:else}<ShieldCheck size={14} />{/if}
        {title}
      </div>
    </div>

    {#if isLoading}
      <div class="flex flex-col items-center py-6">
        <Loader class={`${loaderColor} animate-spin mb-3`} size={24} />
        <p class="text-slate-400 text-xs">Authenticating...</p>
      </div>
    {:else}
      {#if error}
        <div class="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-3 mb-4">
          <span class="text-rose-500 mt-0.5 shrink-0"><X size={14} /></span>
          <p class="text-rose-600 text-xs">{error}</p>
        </div>
      {/if}
      {#if bio}
        <div class="space-y-4 mb-4">
          <div class={`rounded-2xl border p-6 flex flex-col items-center gap-3 ${
            bio.success ? "bg-emerald-50 border-emerald-100" : "bg-rose-50 border-rose-100"
          }`}>
            <div class={`w-16 h-16 rounded-full flex items-center justify-center ${
              bio.success ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"
            }`}>
              {#if bio.success}<ShieldCheck size={32} />{:else}<ShieldX size={32} />{/if}
            </div>
            <p class={`text-sm font-semibold ${bio.success ? "text-emerald-700" : "text-rose-700"}`}>
              {bio.success ? "Authentication successful" : "Authentication failed"}
            </p>
            {#if bio.error}
              <p class="text-xs text-slate-500 text-center">{bio.error}</p>
            {/if}
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
        {#if color === "emerald"}<Fingerprint size={16} />{:else}<ShieldCheck size={16} />{/if}
        {actionLabel}
      </button>
    {/if}
  </div>
{/snippet}

<div class="min-h-full p-6 md:p-10 lg:p-14">
  <div class="max-w-4xl mx-auto">
    <div class="text-center mb-10">
      <div class="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full text-emerald-600 text-xs font-medium mb-4">
        <Fingerprint size={14} />
        Biometric
      </div>
      <h1 class="text-3xl font-bold text-slate-800">Biometric Auth</h1>
      <p class="text-slate-400 text-sm mt-2">Authenticate with your fingerprint or face</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      {@render biometricCard("WITH SDK", "emerald", biometric, biometricLoading, biometricError, onAuthenticate, "Authenticate with SDK")}
      {@render biometricCard("WITHOUT SDK", "sky", webBiometric, webBiometricLoading, webBiometricError, onAuthenticateWeb, "Authenticate (WebAuthn)")}
    </div>
  </div>
</div>
