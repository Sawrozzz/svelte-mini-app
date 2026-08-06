<script lang="ts">
  import PlatformSDKProvider from "./providers/PlatformSDKProvider.svelte";
  import MiniAppIndex from "./components/MiniAppIndex.svelte";

  let { initialPath }: { initialPath?: string } = $props();

</script>

<PlatformSDKProvider>
  <MiniAppIndex {initialPath} />
</PlatformSDKProvider>
