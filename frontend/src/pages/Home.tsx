import { Link } from "react-router-dom"
import GoogleButton from "../components/GoogleButton"

export default function Home() {

  return (
    <div>

      <h1>Home</h1>

      <Link to="/login">
        <button>Login</button>
      </Link>

      <GoogleButton />

    </div>
  )
}
