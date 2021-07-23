import { useState, useEffect, useContext } from "react";
import firebase from "../../services/firebaseConnection";
import { useHistory, useParams } from "react-router-dom";
import Header from "../../components/Header";
import Title from "../../components/Title";
import { AuthContext } from "../../contexts/auth";
import { toast } from "react-toastify";
import "./new.css";
import { FiPlusCircle } from "react-icons/fi";

export default function New() {
  const { id } = useParams();
  const history = useHistory();

  const [loadDisciplinas, setLoadDisciplinas] = useState(true);
  const [disciplinas, setDisciplinas] = useState([]);
  const [disciplinasSelected, setDisciplinasSelected] = useState(0);

  const [semestre, setSemestre] = useState("1°");
  const [status, setStatus] = useState("Aberto");
  const [informacoes, setInformacoes] = useState("");

  const [idDisciplinas, setIdDisciplinas] = useState(false);

  const { user } = useContext(AuthContext);

  useEffect(() => {
    async function loadDisciplinas() {
      await firebase
        .firestore()
        .collection("Disciplinas")
        .get()
        .then((snapshot) => {
          let lista = [];

          snapshot.forEach((doc) => {
            lista.push({
              id: doc.id,
              nome: doc.data().nome,
            });
          });

          if (lista.length === 0) {
            console.log("NENHUMA DISCIPLINA ENCONTRADA");
            setDisciplinas([{ id: "1", nome: "Adicione uma disciplina" }]);
            setLoadDisciplinas(false);
            return;
          }

          setDisciplinas(lista);
          setLoadDisciplinas(false);

          if (id) {
            loadId(lista);
          }
        })
        .catch((error) => {
          console.log("DEU ALGUM ERRO!", error);
          setLoadDisciplinas(false);
          setDisciplinas([{ id: "1", nome: "" }]);
        });
    }

    loadDisciplinas();
  }, [id]);


  //VISUALIZAR/LER atividade - CRUD
  async function loadId(lista) {
    await firebase
      .firestore()
      .collection("atividades")
      .doc(id)
      .get()
      .then((snapshot) => {
        setSemestre(snapshot.data().semestre);
        setStatus(snapshot.data().status);
        setInformacoes(snapshot.data().informacoes);

        let index = lista.findIndex(
          (item) => item.id === snapshot.data().disciplinasId
        );
        setDisciplinasSelected(index);
        setIdDisciplinas(true);
      })
      .catch((err) => {
        console.log("ERRO NO ID PASSADO: ", err);
        setIdDisciplinas(false);
      });
  }

//ATUALIZAR/EDITAR UMA NOVA DISCIPLINA - CRUD
  async function handleRegister(e) {
    e.preventDefault();

    if (idDisciplinas) {
      await firebase
        .firestore()
        .collection("atividades")
        .doc(id)
        .update({
          disciplinas: disciplinas[disciplinasSelected].nome,
          disciplinasId: disciplinas[disciplinasSelected].id,
          semestre: semestre,
          status: status,
          informacoes: informacoes,
          userId: user.uid,
        })
        .then(() => {
          toast.success("Atividade Editada com sucesso!");
          setDisciplinasSelected(0);
          setInformacoes("");
          history.push("/dashboard");
        })
        .catch((err) => {
          toast.error("Ops erro ao editar, tente novamente.");
          console.log(err);
        });

      return;
    }
//CRIANDO NOVA ATIVIDADE - CRUD
    await firebase
      .firestore()
      .collection("atividades")
      .add({
        created: new Date(),
        disciplinas: disciplinas[disciplinasSelected].nome,
        disciplinasId: disciplinas[disciplinasSelected].id,
        semestre: semestre,
        status: status,
        informacoes: informacoes,
        userId: user.uid,
      })
      .then(() => {
        toast.success("Atividade criada com sucesso!");
        setInformacoes("");
        setDisciplinasSelected(0);
      })
      .catch((err) => {
        toast.error("Ops erro ao registrar, tente novamente.");
        console.log(err);
      });
  }

  //Chamado quando troca o semester
  function handleChangeSelect(e) {
    setSemestre(e.target.value);
  }

  //Chamado quando troca o status
  function handleOptionChange(e) {
    setStatus(e.target.value);
  }

  //Chamado quando troca de disciplina
  function handleChangeDisciplinas(e) {
    setDisciplinasSelected(e.target.value);
  }

  return (
    <div>
      <Header />

      <div className="content">
        <Title name="Nova Atividade">
          <FiPlusCircle size={25} />
        </Title>

        <div className="container">
          <form className="form-profile" onSubmit={handleRegister}>
            <label>Disciplina</label>

            {loadDisciplinas ? (
              <input
                type="text"
                disabled={true}
                value="Carregando Atividades..."
              />
            ) : (
              <select
                value={disciplinasSelected}
                onChange={handleChangeDisciplinas}
              >
                {disciplinas.map((item, index) => {
                  return (
                    <option key={item.id} value={index}>
                      {item.nome}
                    </option>
                  );
                })}
              </select>
            )}

            <label>Semestre</label>
            <select value={semestre} onChange={handleChangeSelect}>
              <option value="1°">1°</option>
              <option value="2°">2°</option>
              <option value="3°">3°</option>
              <option value="4°">4°</option>
              <option value="5°">5°</option>
            </select>

            <label>Status</label>
            <div className="status">
              <input
                type="radio"
                name="radio"
                value="Aberto"
                onChange={handleOptionChange}
                checked={status === "Aberto"}
              />
              <span>Aberta</span>

              <input
                type="radio"
                name="radio"
                value="Progresso"
                onChange={handleOptionChange}
                checked={status === "Progresso"}
              />
              <span>Progresso</span>

              <input
                type="radio"
                name="radio"
                value="Atendido"
                onChange={handleOptionChange}
                checked={status === "Entregue"}
              />
              <span>Entregue</span>
            </div>

            <label>Informações</label>
            <textarea
              type="text"
              placeholder="Aqui, você pode detalhar sobre (opcional)."
              value={informacoes}
              onChange={(e) => setInformacoes(e.target.value)}
            />

            <button type="submit">Cadastrar</button>
          </form>
        </div>
      </div>
    </div>
  );
}
