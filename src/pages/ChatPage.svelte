<script lang="ts">
  import TabChat from "../components/tabs/TabChat.svelte";
  import { miniApp } from "../miniapp/state.svelte";
</script>

<TabChat
  navLoading={miniApp.navLoading}
  navResult={miniApp.navResult}
  onNavigate={() => void miniApp.handleNavigate()}
/>
