import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { useParams } from "react-router-dom"
import Spinner from "../../components/Spinner"
import { useState } from "react"
import { useAuth } from "@clerk/clerk-react"
import Comment from "../../components/Comment"

const PostById = () => {
  const { getToken } = useAuth()
  const { postId } = useParams()
  const [comment, setComment] = useState("")
  const queryClient = useQueryClient()
  const token = getToken()

  const getPost = async (): Promise<PostData> => {
    const response = await axios.get(`http://localhost:3000/post/${postId}`)
    return response.data
  }

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["postById", postId],
    queryFn: getPost,
  })

  const handleComment = async () => {
    const response = await axios.post(
      `http://localhost:3000/comment/${postId}`,
      { content: comment },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await token}`,
        },
      }
    )
    return response.data
  }

  const mutation = useMutation({
    mutationFn: handleComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["postById"] })
    },
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    mutation.mutate()
  }

  const { isPending: commentIsPending, isError: commentIsError, error: commentError } = mutation

  return (
    <div className="flex flex-col md:flex-row gap-4 flex-grow">
      <div className="md:w-1/3 min-h-60 bg-white rounded-lg">
        {isError && axios.isAxiosError(error) && error.response?.data?.message}
        {isPending && <Spinner />}
        {data && (
          <div className="bg-white rounded-lg p-2 flex flex-col gap-2">
            <h2 className="text-2xl font-semibold border-b-2 border-black">{data.title}</h2>
            <p className="text-xl">{data.content}</p>
          </div>
        )}
      </div>

      <div className="md:w-2/3 flex flex-col gap-2">
        {commentIsError && axios.isAxiosError(commentError) && commentError.response?.data?.message}
        <form className="flex flex-col md:flex-row gap-2 items-center" onSubmit={handleSubmit}>
          <textarea className="p-1 w-2/3 md:w-1/2 rounded-lg" placeholder="Comment" name="comment" value={comment} onChange={(e) => setComment(e.target.value)} />
          <button type="submit" className="bg-blue-500 rounded-lg p-2">
            Submit
          </button>
        </form>
        {commentIsPending && <Spinner />}
        {data?.comments && (
          <div className="flex flex-col gap-2 rounded-lg">
            {data.comments.map((item) => (
              <Comment key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default PostById
