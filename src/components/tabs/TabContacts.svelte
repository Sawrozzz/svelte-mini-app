<script lang="ts">
  import { Loader, Phone, User, Users, X } from "@lucide/svelte";
  import type { SdkDeviceContactResult } from "../../lib/types.ts";

  let {
    contact,
    contactLoading,
    contactError,
    onOpenContactPicker,
    webContact,
    webContactLoading,
    webContactError,
    onOpenWebContactPicker,
  }: {
    contact: SdkDeviceContactResult | null;
    contactLoading: boolean;
    contactError: string | null;
    onOpenContactPicker: () => void;
    webContact: SdkDeviceContactResult | null;
    webContactLoading: boolean;
    webContactError: string | null;
    onOpenWebContactPicker: () => void;
  } = $props();
</script>

{#snippet contactCard(title: string, color: "indigo" | "teal", c: SdkDeviceContactResult | null, isLoading: boolean, error: string | null, onAction: () => void, actionLabel: string)}
  {@const badge = color === "indigo"
    ? "bg-indigo-50 border-indigo-100 text-indigo-600"
    : "bg-teal-50 border-teal-100 text-teal-600"}
  {@const loaderColor = color === "indigo" ? "text-indigo-500" : "text-teal-500"}
  {@const btnGradient = color === "indigo"
    ? "from-indigo-600 to-blue-600 shadow-indigo-600/25 hover:shadow-indigo-600/40"
    : "from-teal-600 to-cyan-600 shadow-teal-600/25 hover:shadow-teal-600/40"}
  <div class="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6">
    <div class="flex items-center gap-2 mb-6">
      <div class={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${badge}`}>
        {#if color === "indigo"}<Users size={14} />{:else}<User size={14} />{/if}
        {title}
      </div>
    </div>

    {#if isLoading && !c}
      <div class="flex flex-col items-center py-6">
        <Loader class={`${loaderColor} animate-spin mb-3`} size={24} />
        <p class="text-slate-400 text-xs">Opening contact picker...</p>
      </div>
    {:else}
      {#if error && !c}
        <div class="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-3 mb-4">
          <span class="text-rose-500 mt-0.5 shrink-0"><X size={14} /></span>
          <p class="text-rose-600 text-xs">{error}</p>
        </div>
      {/if}
      {#if c}
        <div class="space-y-4 mb-4">
          <div class="bg-slate-50 rounded-xl p-4 border border-slate-100 flex items-center gap-4">
            <div class={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
              color === "indigo" ? "bg-indigo-100 text-indigo-600" : "bg-teal-100 text-teal-600"
            }`}>
              <User size={22} />
            </div>
            <div class="min-w-0 flex-1">
              <p class="text-sm font-semibold text-slate-800 truncate">{c.contactName || "—"}</p>
              <p class="text-xs text-slate-500 mt-0.5">{c.number || "—"}</p>
            </div>
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
        {#if color === "indigo"}<Users size={16} />{:else}<User size={16} />{/if}
        {c ? "Pick Another Contact" : actionLabel}
      </button>
    {/if}
  </div>
{/snippet}

<div class="min-h-full p-6 md:p-10 lg:p-14">
  <div class="max-w-4xl mx-auto">
    <div class="text-center mb-10">
      <div class="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-600 text-xs font-medium mb-4">
        <Phone size={14} />
        Contacts
      </div>
      <h1 class="text-3xl font-bold text-slate-800">Contacts</h1>
      <p class="text-slate-400 text-sm mt-2">Pick a contact and preview it instantly</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      {@render contactCard("WITH SDK", "indigo", contact, contactLoading, contactError, onOpenContactPicker, "Open Contact Picker")}
      {@render contactCard("WITHOUT SDK", "teal", webContact, webContactLoading, webContactError, onOpenWebContactPicker, "Pick Contact")}
    </div>
  </div>
</div>
