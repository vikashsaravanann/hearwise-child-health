import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { addObservabilityBreadcrumb, initObservability } from "@/lib/observability";

initObservability();
addObservabilityBreadcrumb("Application bootstrapped", "app.lifecycle");

createRoot(document.getElementById("root")!).render(<App />);
