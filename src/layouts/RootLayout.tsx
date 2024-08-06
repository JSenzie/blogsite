import { Link, Outlet, useNavigate } from "react-router-dom"
import "../index.css"
import { ClerkProvider } from "@clerk/clerk-react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { SignedIn, SignedOut, SignInButton, SignOutButton, UserButton } from "@clerk/clerk-react"

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
      refetchOnWindowFocus: false,
    },
  },
})

const RootLayout = () => {
  const navigate = useNavigate()

  return (
    <ClerkProvider routerPush={(to) => navigate(to)} routerReplace={(to) => navigate(to, { replace: true })} publishableKey={PUBLISHABLE_KEY}>
      <QueryClientProvider client={queryClient}>
        <div className="flex flex-col w-full">
          <header className="flex p-4 items-center  h-[10vh] border-b-2 justify-between">
            <div className="p-2 bg-blue-500 rounded-lg">
              <Link to={"/post/create"}>Create Post</Link>
            </div>
            <div>
              <Link to={{ pathname: "/", search: "" }} className="text-2xl font-bold">
                BlogSite
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <UserButton />
              <SignedOut>
                <SignInButton>
                  <button className="p-2 bg-blue-500 rounded-lg">Sign In</button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <SignOutButton>
                  <button className="p-2 bg-blue-500 rounded-lg">Sign Out</button>
                </SignOutButton>
              </SignedIn>
            </div>
          </header>
          <main className="m-2 p-4 min-h-[80vh] bg-blue-200 rounded-lg flex">
            <Outlet />
          </main>
          <footer className="text-center py-2">Joseph Sensback 2024</footer>
        </div>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ClerkProvider>
  )
}

export default RootLayout
