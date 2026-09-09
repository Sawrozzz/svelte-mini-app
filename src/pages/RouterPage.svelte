<script lang="ts">
  import TabRouter from "../components/tabs/TabRouter.svelte";
  import { handleBackPress, routerLog } from "../router/host-sync.ts";
</script>

<TabRouter log={$routerLog} onBack={() => void handleBackPress()} />
