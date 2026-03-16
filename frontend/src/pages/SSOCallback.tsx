import { HandleSSOCallback } from "@clerk/react"
import { useNavigate } from "react-router-dom"

export default function SSOCallback() {

  const navigate = useNavigate()

  return (
    <HandleSSOCallback
      navigateToApp={({ session }) => {

        if (session?.currentTask) {
          navigate(`/tasks/${session.currentTask.key}`)
          return
        }

        navigate("/dashboard")
      }}
      navigateToSignIn={() => navigate("/login")}
      navigateToSignUp={() => navigate("/login")}
    />
  )
}
