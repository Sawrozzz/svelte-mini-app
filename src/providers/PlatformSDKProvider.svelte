<script lang="ts">
  import { onMount, type Snippet } from "svelte";
  import { setSDKContext } from "../context/sdk";
  import { retry } from "../utils/retry";
  import LoadError from "../components/LoadError.svelte";

  type State =
    | { phase: "loading" }
    | { phase: "ready"; sdk: MiniAppSdk; user: SdkPlatformUser | null }
    | { phase: "error"; error: Error };

  let { children }: { children: Snippet } = $props();

  let state = $state<State>({ phase: "loading" });

  const controller = new AbortController();

  function getSDK() {
    const instance = window.__GSA_SDK__ ?? null;

    if (!instance) {
      throw new Error("SDK not available");
    }

    return instance;
  }

  function withTimeout<T>(promise: Promise<T>, ms: number, label: string) {
    return Promise.race([
      promise,
      new Promise<never>((_, reject) =>
        setTimeout(
          () => reject(new Error(`${label} timed out after ${ms}ms`)),
          ms,
        ),
      ),
    ]);
  }

  console.log(
    "[sdk] provider setup, __GSA_SDK__ present:",
    !!window.__GSA_SDK__,
  );

  // Set during init so children instantiated below already see it.
  setSDKContext({
    get sdk() {
      return state.phase === "ready" ? state.sdk : null;
    },
    get user() {
      return state.phase === "ready" ? state.user : null;
    },
    get isReady() {
      return state.phase === "ready";
    },
    get error() {
      return state.phase === "error" ? state.error : null;
    },
  });

  onMount(() => {
    console.log("[sdk] onMount fired");

    (async () => {
      try {
        const sdk = await retry(() => getSDK(), {
          maxAttempts: 10,
          delayMs: 200,
          signal: controller.signal,
        });
        console.log("[sdk] instance acquired", sdk);

        const user = await withTimeout(
          Promise.resolve(sdk.auth.getUser()),
          5000,
          "auth.getUser()",
        );
        console.log("[sdk] getUser resolved", user);

        if (controller.signal.aborted) {
          console.warn("[sdk] aborted before ready — provider was destroyed");
          return;
        }
        state = { phase: "ready", sdk, user: user ?? null };
      } catch (error) {
        console.error("[sdk] init failed", error);
        if (controller.signal.aborted) {
          console.warn("[sdk] aborted, swallowing error — stuck in loading");
          return;
        }
        state = {
          phase: "error",
          error:
            error instanceof Error
              ? error
              : new Error("SDK initialization failed"),
        };
      }
    })();

    return () => {
      console.warn("[sdk] destroy — provider unmounted, aborting");
      controller.abort();
    };
  });
</script>

{#if state.phase === "error"}
  <LoadError message={state.error.message} />
{:else if state.phase === "ready"}
  {@render children()}
{:else}
  <div>Connecting to platform...</div>
{/if}
