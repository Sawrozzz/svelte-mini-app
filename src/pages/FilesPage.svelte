<script lang="ts">
  import TabFiles from "../components/tabs/TabFiles.svelte";
  import { miniApp } from "../miniapp/state.svelte";
</script>

<TabFiles
  documents={miniApp.documents}
  documentsLoading={miniApp.documentsLoading}
  documentsError={miniApp.documentsError}
  onOpenFilePicker={() => void miniApp.handleFileUpload()}
  webDocuments={miniApp.webDocuments}
  webDocumentsLoading={miniApp.webDocumentsLoading}
  webDocumentsError={miniApp.webDocumentsError}
  onUploadWebFiles={miniApp.handleFileUploadByWeb}
/>
