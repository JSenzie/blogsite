import ReactDOM from "react-dom/client"
import { RouterProvider, createBrowserRouter } from "react-router-dom"
import RootLayout from "./layouts/RootLayout.tsx"
import CreatePost from "./pages/Post/CreatePost.tsx"

import Posts from "./pages/Post/Posts.tsx"
import PostById from "./pages/Post/PostById.tsx"

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/", element: <Posts /> },
      { path: "/post/create", element: <CreatePost /> },
      { path: "/post/:postId", element: <PostById /> },
    ],
  },
])

ReactDOM.createRoot(document.getElementById("root")!).render(<RouterProvider router={router} />)
