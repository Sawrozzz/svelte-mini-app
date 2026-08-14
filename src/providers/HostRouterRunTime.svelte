<script lang="ts">
  import type { Snippet } from "svelte";
import { useHostRouter } from "../hooks/useHostRouter.svelte";

  let { children }: { children: Snippet } = $props();

  useHostRouter();
</script>

{@render children()}