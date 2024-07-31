/// <reference types="vite/client" />

export type Roles = "admin" | "moderator"

declare global {
  interface ErrorMessage {
    message: string
  }

  interface CustomJwtSessionClaims {
    metadata: {
      role?: Roles
    }
  }

  interface CommentData {
    id: string
    content: string
    authorId: string
    postId: string
    createdAt?: string
    author: {
      id: string
    }
  }

  interface PostData {
    id: string
    createdAt: string
    title: string
    content: string
    authorId: string
    comments?: CommentData[]
  }
}

export {}
