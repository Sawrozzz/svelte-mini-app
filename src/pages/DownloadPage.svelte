<script lang="ts">
  import TabDownload from "../components/tabs/TabDownload.svelte";
  import { miniApp } from "../miniapp/state.svelte";
</script>

<TabDownload
  imageDownload={miniApp.imageDownload}
  imageLoading={miniApp.imageLoading}
  imageError={miniApp.imageError}
  onDownloadImage={() => void miniApp.handleDownloadImage()}
  imageDownloadWeb={miniApp.imageDownloadWeb}
  imageLoadingWeb={miniApp.imageLoadingWeb}
  imageErrorWeb={miniApp.imageErrorWeb}
  onDownloadImageWeb={() => void miniApp.handleDownloadImageWeb()}
  fileDownload={miniApp.fileDownload}
  fileLoading={miniApp.fileLoading}
  fileError={miniApp.fileError}
  onDownloadFile={() => void miniApp.handleDownloadFile()}
  fileDownloadWeb={miniApp.fileDownloadWeb}
  fileLoadingWeb={miniApp.fileLoadingWeb}
  fileErrorWeb={miniApp.fileErrorWeb}
  onDownloadFileWeb={() => void miniApp.handleDownloadFileWeb()}
/>
