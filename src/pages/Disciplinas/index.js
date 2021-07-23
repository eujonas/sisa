import "./disciplinas.css";
import Title from "../../components/Title";
import Header from "../../components/Header";
import { useState } from "react";
import { FiUser } from "react-icons/fi";
import firebase from "../../services/firebaseConnection";
import { toast } from "react-toastify";

export default function Disciplinas() {
  const [nome, setNome] = useState("");
  const [professor, setProfessor] = useState("");
  const [curso, setCurso] = useState("");

  async function handleAdd(e) {
    e.preventDefault();
    if (nome !== "" && professor !== "" && curso !== "") {
      await firebase
        .firestore()
        .collection("Disciplinas")
        .add({
          nome: nome,
          professor: professor,
          curso: curso,
        })
        .then(() => {
          setNome();
          setProfessor();
          setCurso();
          toast.info("Disciplina cadastrada com sucesso!");
        })
        .catch((error) => {
          console.log(error);
          toast.error("Erro ao cadastrar!");
        });
    } else {
      toast.error("Por favor, preencha todos os campos!");
    }
  }

  return (
    <div>
      <Header />
      <div className="content">
        <Title name="Adicione uma nova disciplina">
          <FiUser size={25} />
        </Title>

        <div className="container">
          <form className="form-newprof" onSubmit={handleAdd}>
            <label>Nome</label>
            <input
              type="text"
              placeholder="digite o nome da disciplina"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />

            <label>Professor</label>
            <input
              type="text"
              placeholder="digite o nome do professor"
              value={professor}
              onChange={(e) => setProfessor(e.target.value)}
            />

            <label>Curso</label>
            <input
              type="text"
              placeholder="digite o curso do professor"
              value={curso}
              onChange={(e) => setCurso(e.target.value)}
            />

            <button type="submit">Cadastrar</button>
          </form>
        </div>
      </div>
    </div>
  );
}
