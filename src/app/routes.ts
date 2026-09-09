import type { Component } from "svelte";
import {
  Bell,
  Camera,
  Contact,
  Download,
  Fingerprint,
  Folder,
  House,
  Image,
  Images,
  MapPin,
  MessageCircle,
  Route as RouteIcon,
} from "@lucide/svelte";
import BiometricPage from "../pages/BiometricPage.svelte";
import CameraPage from "../pages/CameraPage.svelte";
import ChatPage from "../pages/ChatPage.svelte";
import ContactsPage from "../pages/ContactsPage.svelte";
import DownloadPage from "../pages/DownloadPage.svelte";
import FilesPage from "../pages/FilesPage.svelte";
import GalleryPage from "../pages/GalleryPage.svelte";
import HomePage from "../pages/HomePage.svelte";
import ImagesPage from "../pages/ImagesPage.svelte";
import LocationPage from "../pages/LocationPage.svelte";
import NotFoundPage from "../pages/NotFoundPage.svelte";
import RouterPage from "../pages/RouterPage.svelte";
import TestApiPage from "../pages/TestApiPage.svelte";
import type { TabId } from "../lib/types.ts";

export type NavItem = {
  id: TabId;
  path: string;
  label: string;
  icon: typeof House;
};

const icon = (c: unknown) => c as unknown as typeof House;

export const navItems: NavItem[] = [
  { id: "home", path: "/", label: "Home", icon: icon(House) },
  { id: "test-api", path: "/test-api", label: "Test Api", icon: icon(Bell) },
  { id: "chat", path: "/chat", label: "Chat Here", icon: icon(MessageCircle) },
  { id: "location", path: "/location", label: "Location", icon: icon(MapPin) },
  { id: "camera", path: "/camera", label: "Camera", icon: icon(Camera) },
  { id: "gallery", path: "/gallery", label: "Gallery", icon: icon(Image) },
  { id: "images", path: "/images", label: "Images", icon: icon(Images) },
  { id: "files", path: "/files", label: "Files", icon: icon(Folder) },
  { id: "download", path: "/download", label: "Download", icon: icon(Download) },
  { id: "contact", path: "/contact", label: "Contact", icon: icon(Contact) },
  { id: "biometric", path: "/biometric", label: "Biometric", icon: icon(Fingerprint) },
  { id: "router", path: "/router", label: "Router", icon: icon(RouteIcon) },
];

/**
 * svelte-spa-router route table (hash-based, like React's HashRouter).
 * `/router/*` covers nested pushes from the Router tab (/router/level-1…).
 * `*` mirrors React's `<Navigate replace to="/" />` fallback.
 */
export const routes: Record<string, Component> = {
  "/": HomePage,
  "/test-api": TestApiPage,
  "/chat": ChatPage,
  "/location": LocationPage,
  "/camera": CameraPage,
  "/gallery": GalleryPage,
  "/images": ImagesPage,
  "/files": FilesPage,
  "/download": DownloadPage,
  "/contact": ContactsPage,
  "/biometric": BiometricPage,
  "/router": RouterPage,
  "/router/*": RouterPage,
  "*": NotFoundPage,
};

export const knownPaths = new Set(
  Object.keys(routes).filter((p) => p !== "*" && !p.endsWith("/*")),
);
