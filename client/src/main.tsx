import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { captureAttribution } from "./utils/calculatorAttribution";

captureAttribution(window.location.search);
createRoot(document.getElementById("root")!).render(<App />);
