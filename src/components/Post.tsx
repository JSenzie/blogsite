import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { Link } from "react-router-dom"
import { checkRole } from "../utils/checkRole"
import Spinner from "./Spinner"

const Post = ({ item, getToken, queryClient }: { item: PostData; getToken: () => Promise<string | null>; queryClient: any }) => {
  const isAdmin = checkRole("admin")
  const isModerator = checkRole("moderator")

  const handleDelete = async (postId: string): Promise<void> => {
    const response = await axios.delete(`http://localhost:3000/post/${postId}`, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await getToken()}`,
      },
    })
    return response.data
  }

  const mutation = useMutation({
    mutationFn: handleDelete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] })
    },
  })

  const { isPending } = mutation

  return (
    <div className="flex p-2 m-2 gap-2 border-2 border-yellow-200 hover:bg-red-500 rounded-lg">
      <Link to={`/post/${item.id}`}>
        <h2 className="text-xl font-semibold">{item.title}</h2>
      </Link>
      {(isAdmin || isModerator) && (
        <button
          onClick={async () => {
            mutation.mutate(item.id)
          }}
        >
          Delete Post
        </button>
      )}
      {isPending && <Spinner />}
    </div>
  )
}

export default Post
