export type TabId = "home" | "test-api" | "chat" | "location" | "camera" | "gallery" | "files" | "download" | "contact" | "biometric";

export type Feature = {
  id: string;
  title: string;
  description: string;
  emoji: string;
};

export type FeaturePageProps = {
  feature: Feature;
  isDark: boolean;
};