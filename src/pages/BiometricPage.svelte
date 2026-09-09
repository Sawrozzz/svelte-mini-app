<script lang="ts">
  import TabBiometric from "../components/tabs/TabBiometric.svelte";
  import { miniApp } from "../miniapp/state.svelte";
</script>

<TabBiometric
  biometric={miniApp.biometric}
  biometricLoading={miniApp.biometricLoading}
  biometricError={miniApp.biometricError}
  onAuthenticate={() => void miniApp.handleAuthenticateBiometric()}
  webBiometric={miniApp.webBiometric}
  webBiometricLoading={miniApp.webBiometricLoading}
  webBiometricError={miniApp.webBiometricError}
  onAuthenticateWeb={() => void miniApp.handleAuthenticateBiometricWeb()}
/>
