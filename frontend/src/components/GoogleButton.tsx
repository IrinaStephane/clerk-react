import { useSignIn } from "@clerk/react"

export default function GoogleButton() {

  const { signIn } = useSignIn()

  async function connexionGoogle() {

    if (!signIn) return

    try {
      await signIn.sso({
        strategy: "oauth_google",
        redirectCallbackUrl: "/sso-callback",
        redirectUrl: "/dashboard",
      })
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <button onClick={connexionGoogle}>
      Continuer avec Google
    </button>
  )
}
