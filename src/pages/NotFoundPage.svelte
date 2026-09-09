<script lang="ts">
  import { onMount } from "svelte";
  import { replaceTo } from "../router/navigation.ts";

  // Mirrors React's `<Navigate replace to="/" />` fallback.
  onMount(() => {
    void replaceTo("/");
  });
</script>
