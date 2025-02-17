import { createBrowserRouter } from "react-router-dom";
import { Home } from "./lazy.pages";

export const router = createBrowserRouter([
  {
    path: "/auth/login",
    // element: (
    //   <Suspense>
    //     <Login />
    //   </Suspense>
    // ),
  },
  {
    path: "",
    // element: <RequireAuth />,
    children: [
      {
        path: "/",
        // element: <Layout />,
        children: [
          {
            index: true,
            element: (
              //   <Suspense>
              <Home />
              //   </Suspense>
            ),
          },
        ],
      },
    ],
  },
]);
