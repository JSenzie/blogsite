const Comment = ({ item }: { item: CommentData }) => {
  return (
    <div className="border-2 flex p-2 rounded-lg justify-between gap-4">
      <p className="break-all">{item.content}</p>
      <p className="text-nowrap">{item.createdAt?.split("T")[0]}</p>
    </div>
  )
}

export default Comment
