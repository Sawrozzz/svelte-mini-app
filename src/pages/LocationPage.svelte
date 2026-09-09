<script lang="ts">
  import TabLocation from "../components/tabs/TabLocation.svelte";
  import { miniApp } from "../miniapp/state.svelte";
</script>

<TabLocation
  loadLocation={miniApp.loadLocation}
  location={miniApp.location}
  sdkError={miniApp.error}
  loadBrowserLocation={miniApp.loadBrowserLocation}
  browserLocation={miniApp.browserLocation}
  browserError={miniApp.browserError}
  onViewSdkLocation={() => void miniApp.handleViewSdkLocation()}
  onViewBrowserLocation={miniApp.handleViewBrowserLocation}
/>
