import { getSdkOrThrow } from "../stores/sdk.ts";
import type {
  DriverLicense,
  SdkDeviceBiometricResult,
  SdkDeviceContactResult,
  SdkDeviceDownloadResult,
  SdkFileModule,
  User,
} from "../lib/types.ts";

/**
 * All mini-app domain state + device/SDK actions, segregated out of App.
 *
 * 1:1 port of test-mini-app's `MiniApp/index.tsx` state and callbacks.
 * Methods are arrow-function fields so they stay bound when passed as props.
 * Consumed by the thin `src/pages/*` wrappers (one per route).
 */
export class MiniAppState {
  loading = $state(false);
  navResult = $state("");
  navLoading = $state(false);

  location = $state<SdkDeviceLocationResult | null>(null);
  loadLocation = $state(false);
  error = $state("");

  browserLocation = $state<SdkDeviceLocationResult | null>(null);
  browserError = $state<string | null>(null);
  loadBrowserLocation = $state(false);

  cameraResponse = $state<SdkDeviceCameraResult | null>(null);
  cameraError = $state<string | null>(null);
  loadCamera = $state(false);

  license = $state<DriverLicense | null>(null);

  userData = $state<User | null>(null);
  loadUser = $state(false);
  userError = $state<string | null>(null);

  gallery = $state<SdkFileModule[] | null>(null);
  galleryLoading = $state(false);
  galleryError = $state<string | null>(null);

  webImages = $state<SdkFileModule[] | null>(null);
  webImagesLoading = $state(false);
  webImagesError = $state<string | null>(null);

  documents = $state<SdkFileModule[] | null>(null);
  documentsLoading = $state(false);
  documentsError = $state<string | null>(null);

  webDocuments = $state<SdkFileModule[] | null>(null);
  webDocumentsLoading = $state(false);
  webDocumentsError = $state<string | null>(null);

  browserCamera = $state<SdkDeviceCameraResult | null>(null);
  browserCameraLoading = $state(false);
  browserCameraError = $state<string | null>(null);

  imageDownload = $state<SdkDeviceDownloadResult | null>(null);
  imageLoading = $state(false);
  imageError = $state<string | null>(null);
  imageDownloadWeb = $state(false);
  imageLoadingWeb = $state(false);
  imageErrorWeb = $state<string | null>(null);

  fileDownload = $state<SdkDeviceDownloadResult | null>(null);
  fileLoading = $state(false);
  fileError = $state<string | null>(null);
  fileDownloadWeb = $state(false);
  fileLoadingWeb = $state(false);
  fileErrorWeb = $state<string | null>(null);

  contact = $state<SdkDeviceContactResult | null>(null);
  contactLoading = $state(false);
  contactError = $state<string | null>(null);

  webContact = $state<SdkDeviceContactResult | null>(null);
  webContactLoading = $state(false);
  webContactError = $state<string | null>(null);

  biometric = $state<SdkDeviceBiometricResult | null>(null);
  biometricLoading = $state(false);
  biometricError = $state<string | null>(null);

  webBiometric = $state<SdkDeviceBiometricResult | null>(null);
  webBiometricLoading = $state(false);
  webBiometricError = $state<string | null>(null);

  // --- license / test-api ---

  setLicense = (license: DriverLicense) => {
    this.license = license;
  };

  handleHttpGet = async () => {
    const sdk = getSdkOrThrow();
    this.loading = true;
    try {
      const res = await sdk.http.post<{
        data: { driverLicense: DriverLicense };
        error?: string;
      }>({
        endpoint: "/api/driving-license",
        body: { method: "GET", path: "/v1/license" },
        headers: { "x-app-id": "mini-revenue-app" },
      });
      if (res.data) this.setLicense(res.data.data.driverLicense);
      else this.error = "Unknown error";
    } catch (err) {
      console.error(err);
    } finally {
      this.loading = false;
    }
  };

  handleFetchUser = async () => {
    this.loadUser = true;
    this.userError = null;
    this.userData = null;
    try {
      const res = await fetch("https://jsonplaceholder.typicode.com/users/1");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      this.userData = (await res.json()) as User;
    } catch (err) {
      this.userError =
        err instanceof Error ? err.message : "Failed to fetch user data";
    } finally {
      this.loadUser = false;
    }
  };

  // --- chat ---

  handleNavigate = async () => {
    const sdk = getSdkOrThrow();
    this.navLoading = true;
    this.navResult = "";
    try {
      const payload = {
        purpose: "Want to chat with AI",
        sourceApp: "mini-revenue-app",
        timestamp: Date.now().toString(),
      };
      await sdk.navigation.navigate({
        route: "/",
        app: "chat-mini-app",
        params: payload,
      });
      this.navResult = "Payment workflow initialized!";
    } catch (err) {
      this.navResult = `Error: ${err instanceof Error ? err.message : String(err)}`;
    } finally {
      this.navLoading = false;
    }
  };

  // --- location ---

  handleViewSdkLocation = async () => {
    const sdk = getSdkOrThrow();
    this.loadLocation = true;
    this.error = "";
    this.location = null;
    try {
      const res = await sdk.device.location({
        reason: "To view your current location",
      });
      switch (res.status) {
        case "granted":
          this.location =
            (res.data as SdkDeviceLocationResult | undefined) ?? null;
          break;
        case "denied":
          this.error = "Location permission denied.";
          break;
        case "permanentlyDenied":
          this.error = "Please enable location permission from device settings.";
          break;
        case "restricted":
          this.error = "Location access is restricted on this device.";
          break;
      }
    } catch (err) {
      this.error =
        err instanceof Error ? err.message : "Failed to get location via SDK";
    } finally {
      this.loadLocation = false;
    }
  };

  handleViewBrowserLocation = () => {
    this.loadBrowserLocation = true;
    this.browserError = null;
    this.browserLocation = null;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.browserLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: new Date(position.timestamp).toISOString(),
          };
          this.loadBrowserLocation = false;
        },
        (err) => {
          this.browserError = err.message;
          this.loadBrowserLocation = false;
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
      );
    } else {
      this.browserError = "Geolocation is not supported by this browser.";
      this.loadBrowserLocation = false;
    }
  };

  // --- camera ---

  handleOpenCamera = async () => {
    const sdk = getSdkOrThrow();
    this.loadCamera = true;
    this.cameraResponse = null;
    this.cameraError = null;
    try {
      const res = await sdk.device.camera({
        reason: "To capture a photo for verification",
      });
      switch (res.status) {
        case "granted":
          this.cameraResponse =
            (res.data as SdkDeviceCameraResult | undefined) ?? null;
          break;
        case "denied":
          this.cameraError = "Camera permission denied.";
          break;
        case "permanentlyDenied":
          this.cameraError =
            "Please enable camera permission from device settings.";
          break;
        case "restricted":
          this.cameraError = "Camera access is restricted on this device.";
          break;
      }
    } catch (err) {
      this.cameraError =
        err instanceof Error ? err.message : "Failed to open camera.";
    } finally {
      this.loadCamera = false;
    }
  };

  handleOpenBrowserCamera = () => {
    this.browserCameraLoading = true;
    this.browserCameraError = null;
    this.browserCamera = null;
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    let cancelled = true;
    const finish = (err?: string) => {
      if (err) this.browserCameraError = err;
      this.browserCameraLoading = false;
      window.removeEventListener("focus", onWindowFocus);
    };
    const onWindowFocus = () => {
      setTimeout(() => {
        if (cancelled) finish("Camera capture cancelled.");
      }, 300);
    };
    window.addEventListener("focus", onWindowFocus);
    input.onchange = () => {
      cancelled = false;
      window.removeEventListener("focus", onWindowFocus);
      if (!input.files || input.files.length === 0) {
        finish("No image captured.");
        return;
      }
      const file = input.files[0];
      const blobUrl = URL.createObjectURL(file);
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      this.browserCamera = {
        url: blobUrl,
        fileName: file.name || `capture-${Date.now()}.${ext}`,
        mimeType: file.type || "image/jpeg",
        byteSize: file.size,
      };
      finish();
    };
    input.click();
  };

  // --- gallery / images ---

  handleImages = async () => {
    const sdk = getSdkOrThrow();
    this.galleryLoading = true;
    this.galleryError = null;
    try {
      const res = await sdk.device.gallery({
        reason: "To select images",
        multiple: true,
      });
      switch (res.status) {
        case "granted": {
          const galleryData = res.data as unknown;
          this.gallery = Array.isArray(galleryData)
            ? (galleryData as SdkFileModule[])
            : ((galleryData as { images?: SdkFileModule[] | null } | undefined)
                ?.images ?? null);
          break;
        }
        case "denied":
          this.galleryError = "Image upload cancelled.";
          break;
        case "permanentlyDenied":
          this.galleryError =
            "Please enable gallery permission from device settings.";
          break;
        case "restricted":
          this.galleryError = "Gallery access is restricted on this device.";
          break;
      }
    } catch (err) {
      this.galleryError =
        err instanceof Error ? err.message : "Failed to open gallery.";
    } finally {
      this.galleryLoading = false;
    }
  };

  handleImageUploadByWebOnly = () => {
    this.webImagesLoading = true;
    this.webImagesError = null;
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.accept = "image/*";
    let cancelled = true;
    const finish = (err?: string) => {
      if (err) this.webImagesError = err;
      this.webImagesLoading = false;
      window.removeEventListener("focus", onWindowFocus);
    };
    const onWindowFocus = () => {
      setTimeout(() => {
        if (cancelled) finish("No files selected.");
      }, 300);
    };
    window.addEventListener("focus", onWindowFocus);
    input.onchange = () => {
      cancelled = false;
      window.removeEventListener("focus", onWindowFocus);
      if (!input.files || input.files.length === 0) {
        finish("No files selected.");
        return;
      }
      this.webImages = Array.from(input.files).map((file) => {
        const blobUrl = URL.createObjectURL(file);
        const ext = file.name.split(".").pop()?.toLowerCase() || "";
        return {
          url: blobUrl,
          previewUrl: blobUrl,
          fileName: file.name,
          mimeType: file.type || "image/jpeg",
          extension: ext,
          byteSize: file.size,
        };
      });
      finish();
    };
    input.click();
  };

  // --- files ---

  handleFileUpload = async () => {
    const sdk = getSdkOrThrow();
    this.documentsLoading = true;
    this.documentsError = null;
    try {
      const res = await sdk.device.files({
        reason: "To select documents",
        multiple: true,
      });
      switch (res.status) {
        case "granted": {
          const filesData = res.data as unknown;
          this.documents = Array.isArray(filesData)
            ? (filesData as SdkFileModule[])
            : ((filesData as { files?: SdkFileModule[] | null } | undefined)
                ?.files ?? null);
          break;
        }
        case "denied":
          this.documentsError = "File access denied.";
          break;
        case "permanentlyDenied":
          this.documentsError = "Please enable file access from device settings.";
          break;
        case "restricted":
          this.documentsError = "File access is restricted on this device.";
          break;
      }
    } catch (err) {
      this.documentsError =
        err instanceof Error ? err.message : "Failed to open file picker.";
    } finally {
      this.documentsLoading = false;
    }
  };

  handleFileUploadByWeb = () => {
    this.webDocumentsLoading = true;
    this.webDocumentsError = null;
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    let cancelled = true;
    const finish = (err?: string) => {
      if (err) this.webDocumentsError = err;
      this.webDocumentsLoading = false;
      window.removeEventListener("focus", onWindowFocus);
    };
    const onWindowFocus = () => {
      setTimeout(() => {
        if (cancelled) finish("No files selected.");
      }, 300);
    };
    window.addEventListener("focus", onWindowFocus);
    input.onchange = () => {
      cancelled = false;
      window.removeEventListener("focus", onWindowFocus);
      if (!input.files || input.files.length === 0) {
        finish("No files selected.");
        return;
      }
      this.webDocuments = Array.from(input.files).map((file) => {
        const blobUrl = URL.createObjectURL(file);
        const ext = file.name.split(".").pop()?.toLowerCase() || "";
        return {
          url: blobUrl,
          previewUrl: file.type?.startsWith("image/") ? blobUrl : undefined,
          fileName: file.name,
          mimeType: file.type || "application/octet-stream",
          extension: ext,
          byteSize: file.size,
        };
      });
      finish();
    };
    input.click();
  };

  // --- downloads ---

  handleDownloadImage = async () => {
    const sdk = getSdkOrThrow();
    this.imageLoading = true;
    this.imageError = null;
    this.imageDownload = null;
    try {
      const res = await sdk.device.download({
        url: "https://picsum.photos/1200/800",
        fileName: "sample-image.jpg",
        mimeType: "image/jpeg",
        reason: "To download the selected image",
      });
      switch (res.status) {
        case "granted":
          this.imageDownload =
            (res.data as unknown as SdkDeviceDownloadResult | undefined) ??
            null;
          break;
        case "denied":
          this.imageError = "Download permission denied.";
          break;
        case "permanentlyDenied":
          this.imageError =
            "Please enable download permission from device settings.";
          break;
        case "restricted":
          this.imageError = "Download is restricted on this device.";
          break;
      }
    } catch (err) {
      this.imageError =
        err instanceof Error ? err.message : "Failed to download file.";
    } finally {
      this.imageLoading = false;
    }
  };

  handleDownloadImageWeb = async () => {
    this.imageLoadingWeb = true;
    this.imageErrorWeb = null;
    this.imageDownloadWeb = false;
    try {
      const response = await fetch("https://picsum.photos/1200/800");
      if (!response.ok) throw new Error("Failed to fetch image.");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "sample-image.jpg";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      this.imageDownloadWeb = true;
    } catch (err) {
      this.imageErrorWeb =
        err instanceof Error ? err.message : "Failed to download image.";
    } finally {
      this.imageLoadingWeb = false;
    }
  };

  handleDownloadFile = async () => {
    const sdk = getSdkOrThrow();
    this.fileLoading = true;
    this.fileError = null;
    this.fileDownload = null;
    try {
      const res = await sdk.device.download({
        url: "https://pdfobject.com/pdf/sample.pdf",
        fileName: "sample.pdf",
        mimeType: "application/pdf",
        reason: "To download the selected file",
      });
      switch (res.status) {
        case "granted":
          this.fileDownload =
            (res.data as unknown as SdkDeviceDownloadResult | undefined) ??
            null;
          break;
        case "denied":
          this.fileError = "Download permission denied.";
          break;
        case "permanentlyDenied":
          this.fileError =
            "Please enable download permission from device settings.";
          break;
        case "restricted":
          this.fileError = "Download is restricted on this device.";
          break;
      }
    } catch (err) {
      this.fileError =
        err instanceof Error ? err.message : "Failed to download file.";
    } finally {
      this.fileLoading = false;
    }
  };

  handleDownloadFileWeb = async () => {
    this.fileLoadingWeb = true;
    this.fileErrorWeb = null;
    this.fileDownloadWeb = false;
    try {
      const response = await fetch("https://pdfobject.com/pdf/sample.pdf");
      if (!response.ok) throw new Error("Failed to fetch file.");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "sample.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      this.fileDownloadWeb = true;
    } catch (err) {
      this.fileErrorWeb =
        err instanceof Error ? err.message : "Failed to download file.";
    } finally {
      this.fileLoadingWeb = false;
    }
  };

  // --- contacts ---

  handleOpenContactPicker = async () => {
    const sdk = getSdkOrThrow();
    this.contactLoading = true;
    this.contactError = null;
    this.contact = null;
    try {
      const res = await sdk.device.contact({ reason: "To select a contact" });
      switch (res.status) {
        case "granted":
          this.contact =
            (res.data as unknown as SdkDeviceContactResult | undefined) ??
            null;
          break;
        case "denied":
          this.contactError = "Contact access denied.";
          break;
        case "permanentlyDenied":
          this.contactError =
            "Please enable contact access from device settings.";
          break;
        case "restricted":
          this.contactError = "Contact access is restricted on this device.";
          break;
      }
    } catch (err) {
      this.contactError =
        err instanceof Error ? err.message : "Failed to open contact picker.";
    } finally {
      this.contactLoading = false;
    }
  };

  handleOpenWebContactPicker = async () => {
    this.webContactLoading = true;
    this.webContactError = null;
    this.webContact = null;
    try {
      const nav = navigator as Navigator & {
        contacts?: {
          select: (
            properties: string[],
            options?: { multiple?: boolean },
          ) => Promise<Array<{ name?: string[]; tel?: string[] }>>;
        };
      };
      if (!nav.contacts || !("ContactsManager" in window)) {
        throw new Error("Contact Picker API is not supported.");
      }
      const selected = await nav.contacts.select(["name", "tel"], {
        multiple: false,
      });
      if (selected.length === 0) return;
      const number = selected[0].tel?.find((t) => t.trim())?.trim();
      if (!number) throw new Error("The selected contact has no phone number.");
      this.webContact = {
        contactName: selected[0].name?.find((n) => n.trim())?.trim(),
        number,
      };
    } catch (err) {
      this.webContactError =
        err instanceof Error ? err.message : "Failed to open contact picker.";
    } finally {
      this.webContactLoading = false;
    }
  };

  // --- biometric ---

  handleAuthenticateBiometric = async () => {
    const sdk = getSdkOrThrow();
    this.biometricLoading = true;
    this.biometricError = null;
    this.biometric = null;
    try {
      const res = await sdk.device.biometric({
        reason: "To verify your identity",
      });
      if (!res.data?.success) {
        this.biometricError = res.error || "Biometric authentication failed.";
      }
      this.biometric =
        (res.data as unknown as SdkDeviceBiometricResult | undefined) ?? null;
    } catch (err) {
      this.biometricError =
        err instanceof Error ? err.message : "Biometric authentication failed.";
    } finally {
      this.biometricLoading = false;
    }
  };

  handleAuthenticateBiometricWeb = async () => {
    const sdk = getSdkOrThrow();
    this.webBiometricLoading = true;
    this.webBiometricError = null;
    this.webBiometric = null;
    try {
      if (!window.PublicKeyCredential) {
        this.webBiometricError = "WebAuthn is not supported by this browser.";
        return;
      }
      const res = await sdk.device.biometric({
        reason: "To verify your identity",
      });
      if (!res.data?.success) {
        this.webBiometricError =
          res.error || "Biometric authentication failed.";
      }
      this.webBiometric =
        (res.data as unknown as SdkDeviceBiometricResult | undefined) ?? null;
    } catch (err) {
      this.webBiometricError =
        err instanceof Error ? err.message : "Biometric authentication failed.";
    } finally {
      this.webBiometricLoading = false;
    }
  };
}

/** App-lifetime singleton — pages bind its fields to tab props. */
export const miniApp = new MiniAppState();
