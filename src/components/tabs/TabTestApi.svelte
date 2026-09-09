<script lang="ts">
  import {
    Building,
    FileText,
    Globe,
    Link2,
    Loader,
    Mail,
    MapPin,
    Phone,
    ShieldCheck,
    User as UserIcon,
  } from "@lucide/svelte";
  import type { DriverLicense, User } from "../../lib/types.ts";

  let {
    license,
    loading,
    error,
    onFetchLicense,
    userData,
    loadUser,
    userError,
    onFetchUser,
  }: {
    license: DriverLicense | null;
    loading: boolean;
    error: string;
    onFetchLicense: () => void;
    userData: User | null;
    loadUser: boolean;
    userError: string | null;
    onFetchUser: () => void;
  } = $props();
</script>

<div class="min-h-full p-6 md:p-10 lg:p-14">
  <div class="max-w-4xl mx-auto">
    <div class="text-center mb-8">
      <div class="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-full text-blue-600 text-xs font-medium mb-4">
        <ShieldCheck size={14} />
        API Integration
      </div>
      <h1 class="text-3xl font-bold text-slate-800">Data Fetch</h1>
      <p class="text-slate-400 text-sm mt-2">Fetch data via SDK or public API</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div class="p-6">
          <div class="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-full text-blue-600 text-xs font-medium mb-6">
            <ShieldCheck size={14} />
            WITH SDK
          </div>
          <div>
            {#if loading && !license}
              <button
                class="w-full bg-blue-600 text-white py-3.5 rounded-xl font-semibold shadow-sm opacity-50 cursor-not-allowed"
                disabled
                type="button"
              >
                Loading License...
              </button>
            {:else}
              {#if error && !license}
                <div class="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-3 mb-4">
                  <span class="text-rose-500 mt-0.5 shrink-0"><FileText size={14} /></span>
                  <p class="text-rose-600 text-xs">{error}</p>
                </div>
              {/if}
              {#if license}
                <div class="space-y-6 mb-4">
                  <div class="relative bg-linear-to-br from-slate-50 to-slate-100/50 rounded-2xl p-5 border border-slate-200 flex flex-col sm:flex-row gap-5 items-center sm:items-start">
                    <div class="flex flex-col items-center text-center sm:text-left">
                      <div class="w-28 h-36 bg-slate-200 rounded-xl overflow-hidden shadow-sm border-2 border-white ring-1 ring-slate-200">
                        <img
                          alt="Profile"
                          class="w-full h-full object-cover"
                          src={license.photoUrl ||
                            "https://thumbs.dreamstime.com/b/man-feeling-suspicious-face-expression-emotion-hesitating-facial-studio-shot-white-isolated-background-copy-space-90927117.jpg"}
                        />
                      </div>
                      <p class="mt-3 font-bold text-slate-800 text-sm leading-tight">
                        {license.firstName} {license.lastName}
                      </p>
                      <p class="text-[11px] text-slate-400 font-medium">{license.licenseNumber}</p>
                    </div>
                    <div class="flex-1 grid grid-cols-2 gap-x-4 gap-y-2 text-xs w-full">
                      <div>
                        <p class="text-[10px] uppercase font-bold text-slate-400">Class</p>
                        <p class="font-semibold text-slate-700">{license.licenseClass}</p>
                      </div>
                      <div>
                        <p class="text-[10px] uppercase font-bold text-slate-400">Expires</p>
                        <p class="font-semibold text-rose-600">{license.expiryDate}</p>
                      </div>
                      <div>
                        <p class="text-[10px] uppercase font-bold text-slate-400">DOB</p>
                        <p class="font-semibold text-slate-700">{license.dateOfBirth}</p>
                      </div>
                      <div>
                        <p class="text-[10px] uppercase font-bold text-slate-400">Blood</p>
                        <p class="font-semibold text-slate-700">{license.bloodGroup}</p>
                      </div>
                      <div class="col-span-2 pt-2 border-t border-slate-200/60 mt-1">
                        <p class="text-[10px] uppercase font-bold text-slate-400">Categories</p>
                        <p class="font-medium text-slate-600">{license.vehicleCategories.join(", ")}</p>
                      </div>
                    </div>
                  </div>
                  <div class="divide-y divide-slate-100 border-t border-b py-2">
                    <div class="grid grid-cols-2 gap-x-4">
                      <div class="py-2.5">
                        <p class="text-[11px] font-bold uppercase tracking-wider text-slate-400">Gender</p>
                        <p class="font-medium text-slate-800 mt-0.5 text-sm">{license.gender}</p>
                      </div>
                      <div class="py-2.5">
                        <p class="text-[11px] font-bold uppercase tracking-wider text-slate-400">Issue Date</p>
                        <p class="font-medium text-slate-800 mt-0.5 text-sm">{license.issueDate}</p>
                      </div>
                    </div>
                    <div class="py-2.5">
                      <p class="text-[11px] font-bold uppercase tracking-wider text-slate-400">Address</p>
                      <p class="font-medium text-slate-800 mt-0.5 text-sm">
                        {license.address.street}, {license.address.city}, {license.address.state}
                      </p>
                    </div>
                    <div class="py-2.5">
                      <p class="text-[11px] font-bold uppercase tracking-wider text-slate-400">Issuing Authority</p>
                      <p class="font-medium text-slate-800 mt-0.5 text-sm">{license.issuingAuthority}</p>
                    </div>
                    <div class="grid grid-cols-2 gap-x-4">
                      <div class="py-2.5">
                        <p class="text-[11px] font-bold uppercase tracking-wider text-slate-400">Restrictions</p>
                        <p class="font-medium text-slate-800 mt-0.5 text-sm">{license.restrictions || "None"}</p>
                      </div>
                      <div class="py-2.5">
                        <p class="text-[11px] font-bold uppercase tracking-wider text-slate-400">Organ Donor</p>
                        <p class="font-medium text-slate-800 mt-0.5 text-sm">
                          {license.isOrganDonor ? "❤️ Yes" : "No"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div class="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div>
                      <p class="text-[11px] font-bold uppercase tracking-wider text-slate-400">Official Signature</p>
                      <p class="text-xs text-slate-400 mt-0.5">Digitally Verified ID</p>
                    </div>
                    <img alt="Signature" class="h-10 object-contain mix-blend-multiply opacity-80" src={license.signatureUrl} />
                  </div>
                </div>
              {/if}
            {/if}

            {#if !loading}
              <button
                class="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-semibold shadow-sm transition"
                onclick={onFetchLicense}
                type="button"
              >
                {license ? "Refresh License" : "Show My Driving License"}
              </button>
            {/if}
          </div>
        </div>
      </div>

      <div class="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6">
        <div class="inline-flex items-center gap-2 px-3 py-1.5 bg-cyan-50 border border-cyan-100 rounded-full text-cyan-600 text-xs font-medium mb-6">
          <Globe size={14} />
          WITHOUT SDK
        </div>

        {#if loadUser && !userData}
          <div class="flex flex-col items-center py-6">
            <Loader class="text-cyan-500 animate-spin mb-3" size={24} />
            <p class="text-slate-400 text-xs">Fetching user data...</p>
          </div>
        {:else}
          {#if userError && !userData}
            <div class="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-3 mb-4">
              <span class="text-rose-500 mt-0.5 shrink-0"><FileText size={14} /></span>
              <p class="text-rose-600 text-xs">{userError}</p>
            </div>
          {/if}
          {#if userData}
            <div class="space-y-3">
              <div class="relative bg-linear-to-br from-cyan-50 to-teal-50 rounded-2xl p-5 border border-cyan-200 flex items-center gap-4">
                <div class="w-16 h-16 bg-linear-to-br from-cyan-400 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
                  <UserIcon class="text-white" size={32} />
                </div>
                <div>
                  <p class="text-lg font-bold text-slate-800">{userData.name}</p>
                  <p class="text-cyan-600 text-sm font-medium">@{userData.username}</p>
                </div>
              </div>
              <div class="divide-y border-t border-b border-slate-100">
                <div class="grid grid-cols-2 gap-x-4">
                  <div class="py-2.5">
                    <p class="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1"><Mail size={12} />Email</p>
                    <p class="font-medium text-slate-800 mt-0.5 text-sm">{userData.email}</p>
                  </div>
                  <div class="py-2.5">
                    <p class="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1"><Phone size={12} />Phone</p>
                    <p class="font-medium text-slate-800 mt-0.5 text-sm">{userData.phone}</p>
                  </div>
                </div>
                <div class="py-2.5">
                  <p class="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1"><Link2 size={12} />Website</p>
                  <p class="font-medium text-slate-800 mt-0.5 text-sm">{userData.website}</p>
                </div>
                <div class="py-2.5">
                  <p class="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1"><MapPin size={12} />Address</p>
                  <p class="font-medium text-slate-800 mt-0.5 text-sm">
                    {userData.address.street}, {userData.address.suite}, {userData.address.city}, {userData.address.zipcode}
                  </p>
                </div>
                <div class="py-2.5">
                  <p class="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1"><Building size={12} />Company</p>
                  <p class="font-medium text-slate-800 mt-0.5 text-sm">
                    {userData.company.name} — {userData.company.catchPhrase}
                  </p>
                </div>
              </div>
            </div>
          {/if}
        {/if}

        {#if !loadUser}
          <button
            class="w-full bg-linear-to-r from-cyan-600 to-teal-600 text-white px-8 py-3.5 rounded-xl font-semibold text-sm shadow-lg shadow-cyan-600/25 hover:shadow-cyan-600/40 transition-all duration-300 hover:scale-[1.02] inline-flex items-center justify-center gap-2 mt-4"
            onclick={onFetchUser}
            type="button"
          >
            <Globe size={16} />
            Fetch User
          </button>
        {/if}
      </div>
    </div>
  </div>
</div>
