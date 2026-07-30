import React from "react";
import { createRoot } from "react-dom/client";
import { installStorage } from "./storage.js";
import TransferDesk from "./transfer-desk.jsx";

// Must run before the app mounts — TransferDesk reads window.storage on boot.
installStorage();

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <TransferDesk />
  </React.StrictMode>
);
