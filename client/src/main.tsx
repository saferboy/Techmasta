import { createRoot } from "react-dom/client";

import { RouterProviders } from "./providers/route-providers";
import "./index.css";

createRoot(document.getElementById("root")!).render(<RouterProviders />);
