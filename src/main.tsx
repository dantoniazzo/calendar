import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import "./index.css";
import { ClerkProvider } from "@clerk/clerk-react";
import { dark } from "@clerk/themes";
import { env } from "app/config";

const CLERK_KEY = env.clerk.publishableKey;

createRoot(document.getElementById("root")!).render(
  <ClerkProvider
    appearance={{
      baseTheme: dark,
    }}
    publishableKey={CLERK_KEY}
    afterSignOutUrl="/"
  >
    <RouterProvider router={router} />
  </ClerkProvider>
);
