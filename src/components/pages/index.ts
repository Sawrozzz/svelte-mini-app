import type { Component } from "svelte";
import type { FeaturePageProps } from "../../types";
import LocationPage from "./LocationPage.svelte";

export const featurePages: Record<string, Component<FeaturePageProps>> = {
  location: LocationPage,
};
