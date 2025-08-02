import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import { EditorPage } from "./pages/EditorPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/notes/:id",
    element: <EditorPage />,
  },
]);
