import { getSDKContext, type SDKContextValue } from "../context/sdk";

export function usePlatformSDK(): SDKContextValue {
  const ctx = getSDKContext();
  if (!ctx) {
    throw new Error("usePlatformSDK must be used within PlatformSDKProvider");
  }
  return ctx;
}
