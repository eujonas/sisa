import "./dashboard.css";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import Header from "../../components/Header";
import Title from "../../components/Title";
import {
  FiMessageSquare,
  FiPlus,
  FiSearch,
  FiEdit2,
  FiDelete,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import firebase from "../../services/firebaseConnection";
import Modal from "../../components/Modal";
import { toast } from "react-toastify";

const listRef = firebase
  .firestore()
  .collection("atividades")
  .orderBy("created", "desc");

export default function Dashboard() {
  const [atividades, setAtividades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const [lastDocs, setLastDocs] = useState();

  const [showPostModal, setShowPostModal] = useState(false);
  const [detail, setDetail] = useState();

  useEffect(() => {
    async function loadAtividades() {
      await listRef
        .limit(5)
        .get()
        .then((snapshot) => {
          updateState(snapshot);
        })
        .catch((err) => {
          console.log("Deu algum erro: ", err);
          setLoadingMore(false);
        });

      setLoading(false);
    }

    loadAtividades();

    return () => {};
  }, []);

  async function updateState(snapshot) {
    const isCollectionEmpty = snapshot.size === 0;

    if (!isCollectionEmpty) {
      let lista = [];

      snapshot.forEach((doc) => {
        lista.push({
          id: doc.id,
          semestre: doc.data().semestre,
          disciplinas: doc.data().disciplinas,
          disciplinasId: doc.data().disciplinasId,
          created: doc.data().created,
          createdFormated: format(doc.data().created.toDate(), "dd/MM/yyyy"),
          status: doc.data().status,
          informacoes: doc.data().informacoes,
        });
      });

      const lastDoc = snapshot.docs[snapshot.docs.length - 1]; //Pegando o ultimo documento buscado

      setAtividades((atividades) => [...atividades, ...lista]);
      setLastDocs(lastDoc);
    } else {
      setIsEmpty(true);
    }

    setLoadingMore(false);
  }
  async function handleMore() {
    setLoadingMore(true);
    await listRef
      .startAfter(lastDocs)
      .limit(3)
      .get()
      .then((snapshot) => {
        updateState(snapshot);
      });
  }
  function togglePostModal(item) {
    setShowPostModal(!showPostModal); //trocando de true pra false
    setDetail(item);
  }

  if (loading) {
    return (
      <div>
        <Header />

        <div className="content">
          <Title name="Atividades">
            <FiMessageSquare size={25} />
          </Title>

          <div className="container dashboard">
            <span>Buscando atividades...</span>
          </div>
        </div>
      </div>
    );
  }

  //apagar/deleter atividade - crud
  async function excluirPost(id) {
    await firebase
      .firestore()
      .collection("atividades")
      .doc(id)
      .delete()
      .then(() => {
        toast.error("Atividade excluída com sucesso!");
      });
  }

  return (
    <div>
      <Header />

      <div className="content">
        <Title name="Atividades">
          <FiMessageSquare size={25} />
        </Title>

        {atividades.length === 0 ? (
          <div className="container dashboard">
            <span>Nenhuma atividade registrada...</span>

            <Link to="/new" className="new">
              <FiPlus size={25} color="#FFF" />
              Adicione uma atividade
            </Link>
          </div>
        ) : (
          <>
            <Link to="/new" className="new">
              <FiPlus size={25} color="#FFF" />
              Nova atividade
            </Link>
            <table>
              <thead>
                <tr>
                  <th scope="col">Disciplina</th>
                  <th scope="col">Semestre</th>
                  <th scope="col">Status</th>
                  <th scope="col">Cadastrado em</th>
                  <th scope="col">CRUD</th>
                </tr>
              </thead>
              <tbody>
                {atividades.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td data-label="Disciplina">{item.disciplinas}</td>
                      <td data-label="Semestre">{item.semestre}</td>
                      <td data-label="Status">
                        <span
                          className="badge"
                          style={{
                            backgroundColor:
                              item.status === "Aberto" ? "#5cb85c" : "#999",
                          }}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td data-label="Cadastrado">{item.createdFormated}</td>
                      <td data-label="#">
                        <button
                          className="action"
                          style={{ backgroundColor: "#3583f6" }}
                          onClick={() => togglePostModal(item)}
                        >
                          <FiSearch color="#FFF" size={17} />
                        </button>
                        <Link
                          className="action"
                          style={{ backgroundColor: "#F6a935" }}
                          to={`/new/${item.id}`}
                        >
                          <FiEdit2 color="#FFF" size={17} />
                        </Link>
                        <button
                          className="action"
                          style={{ backgroundColor: "#F65835" }}
                          onClick={() => excluirPost(item.id)}
                        >
                          <FiDelete color="FFF" size={17} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {loadingMore && (
              <h3 style={{ textAlign: "center", marginTop: 15 }}>
                Buscando dados...
              </h3>
            )}
            {!loadingMore && !isEmpty && (
              <button className="btn-more" onClick={handleMore}>
                Buscar mais
              </button>
            )}
          </>
        )}
      </div>
      {showPostModal && <Modal conteudo={detail} close={togglePostModal} />}
    </div>
  );
}
