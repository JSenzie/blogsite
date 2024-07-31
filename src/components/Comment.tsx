const Comment = ({ item }: { item: CommentData }) => {
  return (
    <div className="border-2 flex p-2 rounded-lg justify-between">
      <p>{item.content}</p>
      <p>{item.createdAt?.split("T")[0]}</p>
    </div>
  )
}

export default Comment
