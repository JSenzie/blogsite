import { useState, useEffect, useMemo } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useNavigate, useLocation } from "react-router-dom"
import axios from "axios"
import debounce from "lodash/debounce"
import Spinner from "../../components/Spinner"
import { useAuth } from "@clerk/clerk-react"
import Post from "../../components/Post"

const Posts = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  const [searchQuery, setSearchQuery] = useState("")

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
    const response = await axios.get(`http://localhost:3000/post?q=${queryParam || ""}`)
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
    <div>
      <input className="m-2 p-1 rounded-lg" placeholder="Search" type="text" onChange={debouncedHandleSearch} />
      {isPending && <Spinner />}
      {isError && "Error"}
      {data && !data.length && "No Posts Found"}

      {data && data.map((post: PostData) => <Post key={post.id} item={post} getToken={getToken} queryClient={queryClient} />)}
    </div>
  )
}

export default Posts
