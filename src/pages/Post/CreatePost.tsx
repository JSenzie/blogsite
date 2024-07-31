import { useState } from "react"
import axios from "axios"
import { RedirectToSignIn, SignedIn, SignedOut, useAuth } from "@clerk/clerk-react"
import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import Spinner from "../../components/Spinner"

const CreatePost = () => {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const { getToken } = useAuth()
  const navigate = useNavigate()

  interface PostId {
    id: string
  }

  const sendPost = async (data: { title: string; content: string }): Promise<PostId> => {
    console.log(data.title, data.content)
    const response = await axios.post(
      "http://localhost:3000/post",
      { title: data.title, content: data.content },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await getToken()}`,
        },
      }
    )
    return response.data
  }

  const mutation = useMutation({
    mutationFn: sendPost,
    onSuccess: (data: any) => {
      navigate(`/post/${data.id}`)
    },
  })

  const { error, isError, data, isPending } = mutation

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    mutation.mutate({ title, content })
  }

  return (
    <div className="w-2/3 mx-auto">
      <h1 className="text-center text-xl font-semibold">Create Post</h1>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
      <SignedIn>
        <div className="flex flex-col items-center mx-auto ">
          <form onSubmit={handleSubmit} className="w-full">
            <div className="w-full">
              <h2>Title</h2>
              <input type="text" className="w-full" required value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>

            <div>
              <h2>Content</h2>
              <textarea className="w-full min-h-28" required value={content} onChange={(e) => setContent(e.target.value)} />
            </div>
            <button className="bg-blue-500 rounded-lg p-2">Submit</button>
          </form>
        </div>
        {isPending && <Spinner />}
        {data && data.id}
        {isError && axios.isAxiosError(error) && error.response?.data?.message}
      </SignedIn>
    </div>
  )
}

export default CreatePost
