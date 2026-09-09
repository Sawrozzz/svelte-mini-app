<script lang="ts">
  import TabCamera from "../components/tabs/TabCamera.svelte";
  import { miniApp } from "../miniapp/state.svelte";
</script>

<TabCamera
  loadCamera={miniApp.loadCamera}
  cameraResponse={miniApp.cameraResponse}
  cameraError={miniApp.cameraError}
  onOpenCamera={() => void miniApp.handleOpenCamera()}
  browserCamera={miniApp.browserCamera}
  browserCameraLoading={miniApp.browserCameraLoading}
  browserCameraError={miniApp.browserCameraError}
  onOpenBrowserCamera={miniApp.handleOpenBrowserCamera}
/>
