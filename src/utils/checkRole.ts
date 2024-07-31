import { useUser } from "@clerk/clerk-react"
import { useMemo } from "react"
import { Roles } from "../vite-env"

export const checkRole = (role: Roles) => {
  const { user } = useUser()

  const hasRole = useMemo(() => {
    return user?.publicMetadata?.role === role
  }, [user, role])

  return hasRole
}
