import { useState, useEffect, useMemo } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useNavigate, useLocation } from "react-router-dom"
import axios from "axios"
import debounce from "lodash/debounce"
import Spinner from "../../components/Spinner"
import { useAuth } from "@clerk/clerk-react"
import Post from "../../components/Post"
import { Outlet } from "react-router-dom"

const Posts = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  const [searchQuery, setSearchQuery] = useState("")

  const [open, setOpen] = useState(true)

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    if (searchQuery) {
      params.set("q", searchQuery)
    } else {
      params.delete("q")
    }
    navigate({ search: params.toString() }, { replace: true })
  }, [searchQuery])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const getPosts = async () => {
    const searchParams = new URLSearchParams(location.search)
    const queryParam = searchParams.get("q")
    const response = await axios.get(`https://nsbackend-production.up.railway.app/post?q=${queryParam || ""}`)
    return response.data
  }

  const { isPending, isError, data } = useQuery({
    queryKey: ["posts", location.search],
    queryFn: getPosts,
  })

  const debouncedHandleSearch = useMemo(() => debounce(handleSearch, 500), [])

  useEffect(() => {
    return () => {
      debouncedHandleSearch.cancel()
    }
  }, [debouncedHandleSearch])

  return (
    <div className="flex flex-col md:flex-row w-full gap-2">
      <div className="md:w-1/4">
        <div className="flex gap-2 h-12 mb-2">
          <button
            className="md:hidden h-full w-12 bg-blue-500 hover:bg-blue-600 flex items-center justify-center flex-shrink-0 rounded-lg"
            onClick={() => {
              setOpen(!open)
            }}
          >
            {open ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#fff">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#fff">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            )}
          </button>
          <input className="rounded-lg w-full h-full p-2" placeholder="Search" type="text" onChange={debouncedHandleSearch} />
        </div>

        {isPending && <Spinner />}
        {isError && "Error"}
        {data && !data.length && "No Posts Found"}
        <div className={`md:hidden overflow-hidden transition-[max-height] duration-300 ${open ? "max-h-[1000px]" : "max-h-0"}`}>{data && data.map((post: PostData) => <Post key={post.id} item={post} getToken={getToken} queryClient={queryClient} />)}</div>
        <div className="hidden md:block">{data && data.map((post: PostData) => <Post key={post.id} item={post} getToken={getToken} queryClient={queryClient} />)}</div>
      </div>
      <div className="md:w-3/4">
        <Outlet />
      </div>
    </div>
  )
}

export default Posts
