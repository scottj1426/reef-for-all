import React from "react";
import ReactDOM from "react-dom/client";
import { Auth0Provider } from "@auth0/auth0-react";
import { ChakraProvider } from "@chakra-ui/react";
import App from "./App.tsx";
import theme from "./theme";
import "./index.css";

const domain = import.meta.env.VITE_AUTH0_DOMAIN || "placeholder.auth0.com";
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID || "placeholder-client-id";

// Check Auth0 configuration
const isConfigured =
  domain !== "placeholder.auth0.com" &&
  domain !== "your-auth0-domain.auth0.com" &&
  clientId !== "placeholder-client-id" &&
  clientId !== "your-auth0-client-id";

if (!isConfigured) {
  console.warn("⚠️ Auth0 not configured! Update your .env file with real credentials.");
  console.warn("Required environment variables:");
  console.warn("- VITE_AUTH0_DOMAIN");
  console.warn("- VITE_AUTH0_CLIENT_ID");
}

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <Auth0Provider
        domain={domain}
        clientId={clientId}
        authorizationParams={{
          redirect_uri: window.location.origin,
          audience: "https://reef-for-all-api",
          scope: "openid profile email",
        }}
        cacheLocation="localstorage"
        useRefreshTokens={true}
        onRedirectCallback={(appState) => {
          window.location.replace(appState?.returnTo || '/dashboard');
        }}
      >
        <App />
      </Auth0Provider>
    </ChakraProvider>
  </React.StrictMode>
);
