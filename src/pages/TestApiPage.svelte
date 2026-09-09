<script lang="ts">
  import TabTestApi from "../components/tabs/TabTestApi.svelte";
  import { miniApp } from "../miniapp/state.svelte";
</script>

<TabTestApi
  license={miniApp.license}
  loading={miniApp.loading}
  error={miniApp.error}
  onFetchLicense={() => void miniApp.handleHttpGet()}
  userData={miniApp.userData}
  loadUser={miniApp.loadUser}
  userError={miniApp.userError}
  onFetchUser={() => void miniApp.handleFetchUser()}
/>
