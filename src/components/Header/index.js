import { useContext } from "react";
import "./header.css";
import { AuthContext } from "../../contexts/auth";
import avatar from "../../assets/avatar.png";

import { Link } from "react-router-dom";
import {
  FiFileText,
  FiUserPlus,
  FiSettings,
} from "react-icons/fi";

export default function Header() {
  const { user } = useContext(AuthContext);

  return (
    <div className="sidebar">
      <div>
        <img
          src={user.avatarUrl === null ? avatar : user.avatarUrl}
          alt="Foto avatar"
        />
      </div>
      <Link to="/dashboard">
        <FiFileText color="#000" size={24} />
        Atividades
      </Link>

      <Link to="/create">
        <FiUserPlus color="#000" size={24} />
        Nova Disciplina
      </Link>
      <Link to="/perfil">
        <FiSettings color="#000" size={24} />
        Configurações
      </Link>
    </div>
  );
  
  
}
