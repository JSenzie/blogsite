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
    const response = await axios.get(`https://nsbackend-production.up.railway.app/post/${postId}`)
    return response.data
  }

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["postById", postId],
    queryFn: getPost,
  })

  const handleComment = async () => {
    const response = await axios.post(
      `https://nsbackend-production.up.railway.app/comment/${postId}`,
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
    <div className="flex flex-col lg:flex-row gap-4">
      <div className="min-h-60 bg-white rounded-lg lg:w-2/3 max-h-96 overflow-y-auto p-4">
        {isError && axios.isAxiosError(error) && error.response?.data?.message}
        {isPending && <Spinner />}
        {data && (
          <div className="bg-white rounded-lg flex flex-col gap-2">
            <div className="flex justify-between border-b-2 border-black">
              <h2 className="text-2xl font-semibold ">{data.title}</h2>
              <p>{data.createdAt.split("T")[0]}</p>
            </div>
            <p className="text-xl">{data.content}</p>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 lg:w-1/3">
        {commentIsError && axios.isAxiosError(commentError) && commentError.response?.data?.message}
        <form className="flex gap-2" onSubmit={handleSubmit}>
          <textarea className="p-2 rounded-lg flex-1" placeholder="Comment" name="comment" value={comment} onChange={(e) => setComment(e.target.value)} />
          <button type="submit" className="bg-blue-500 rounded-lg p-2 h-12 w-20">
            Submit
          </button>
        </form>
        {commentIsPending && <Spinner />}
        {data?.comments && (
          <div className="flex flex-col gap-2 rounded-lg w-full">
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
