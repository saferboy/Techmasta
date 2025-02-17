import { createRoot } from "react-dom/client";

import { RouterProviders } from "./providers/route-providers";
import "./index.css";
import { ToasterProviders } from "./providers/toast-providers";

createRoot(document.getElementById("root")!).render(
  <>
    <RouterProviders />
    <ToasterProviders />
  </>
);
