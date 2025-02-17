import { createBrowserRouter } from "react-router-dom";
import { Cart, Home } from "./lazy.pages";

export const router = createBrowserRouter([
  {
    path: "/login",
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
        children: [
          {
            index: true,
            element: <Home />,
          },
          {
            path: "/cart-page",
            element: <Cart />,
          },
        ],
      },
    ],
  },
]);
