import { RouterProvider as RouterProvider } from "react-router-dom";
import { router } from "../routes/routes";

export const RouterProviders = () => {
  return <RouterProvider router={router} />;
};
