<script lang="ts">
  import TabGallery from "../components/tabs/TabGallery.svelte";
  import { miniApp } from "../miniapp/state.svelte";
</script>

<TabGallery
  gallery={miniApp.gallery}
  galleryLoading={miniApp.galleryLoading}
  galleryError={miniApp.galleryError}
  onOpenGallery={() => void miniApp.handleImages()}
  webImages={miniApp.webImages}
  webImagesLoading={miniApp.webImagesLoading}
  webImagesError={miniApp.webImagesError}
  onUploadWebImages={miniApp.handleImageUploadByWebOnly}
/>
