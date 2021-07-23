import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../contexts/auth";
import "./login.css";
import logo from "../../assets/logosisa.png";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { Login, loadingAuth } = useContext(AuthContext);
  function handleSubmit(e) {
    e.preventDefault();
    if (email !== "" && password !== "") {
      Login(email, password);
    }
  }

  return (
    <div className="conteiner-center">
      <div className="login">
        <div className="login-area">
          <img src={logo} alt="Logo do Sistema" />
        </div>

        <form onSubmit={handleSubmit}>
          <h2>Entrar</h2>
          <div class="label__box">
            <i class="bx bx-at login__icon"></i>
          </div>
          <input
            type="text"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div class="label__box">
            <i class="bx bx-lock login__icon"></i>
          </div>
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">
            {loadingAuth ? "Carregando..." : "Acessar"}
          </button>
        </form>
        <Link to="/register">Criar uma conta</Link>
      </div>
    </div>
  );
}

export default Login;
