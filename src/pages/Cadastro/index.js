import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../contexts/auth";
import logo from "../../assets/logosisa.png";
function Cadastro() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { Cadastro, loadingAuth } = useContext(AuthContext);

  function handleSubmit(e) {
    e.preventDefault();
    if (nome !== "" && email !== "" && password !== "") {
      Cadastro(email, password, nome);
    }
  }

  return (
    <div className="conteiner-center">
      <div className="login">
        <div className="login-area">
          <img src={logo} alt="Logo do Sistema" />
        </div>

        <form onSubmit={handleSubmit}>
          <h2>Cadastre-se</h2>
          <div class="label__box">
            <i class="bx bx-user login__icon"></i>
          </div>

          <input
            type="text"
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
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
          <button type="submit">{loadingAuth ? 'Carregando...' : 'Cadastrar'}</button>
        </form>
        <Link to="/">Já possui uma conta? Entre</Link>
      </div>
    </div>
  );
}

export default Cadastro;
