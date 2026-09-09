<script lang="ts">
  import TabContacts from "../components/tabs/TabContacts.svelte";
  import { miniApp } from "../miniapp/state.svelte";
</script>

<TabContacts
  contact={miniApp.contact}
  contactLoading={miniApp.contactLoading}
  contactError={miniApp.contactError}
  onOpenContactPicker={() => void miniApp.handleOpenContactPicker()}
  webContact={miniApp.webContact}
  webContactLoading={miniApp.webContactLoading}
  webContactError={miniApp.webContactError}
  onOpenWebContactPicker={() => void miniApp.handleOpenWebContactPicker()}
/>
