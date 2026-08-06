import { getContext, setContext } from "svelte";

export interface SDKContextValue {
  readonly sdk: MiniAppSdk | null;
  readonly user: SdkPlatformUser | null;
  readonly isReady: boolean;
  readonly error: Error | null;
}

/** Symbol key so nothing outside this module can collide with (or read) it. */
const SDK_CONTEXT_KEY = Symbol("platform-sdk");

/**
 * The value is stored as an object of getters backed by `$state`, so consumers
 * that hold on to it keep seeing fresh values as the provider transitions.
 */
export function setSDKContext(value: SDKContextValue): void {
  setContext(SDK_CONTEXT_KEY, value);
}

export function getSDKContext(): SDKContextValue | undefined {
  return getContext<SDKContextValue | undefined>(SDK_CONTEXT_KEY);
}
