import { useNavigate } from "react-router-dom";

export default function Login() {

  const navigate = useNavigate();

  function handleLogin() {

    localStorage.setItem("auth", "true");

    navigate("/dashboard");
  }

  return (
    <div style={{padding:"50px", textAlign:"center"}}>

      <h1>HotelSmart Login</h1>

      <button onClick={handleLogin} style={{padding:"10px 20px"}}>
        Login
      </button>

    </div>
  );
}