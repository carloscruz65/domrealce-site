import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Exemplo simples (coloque depois validação via backend)
    if (user === "admin" && pass === "Rebolido@25") {
      localStorage.setItem("auth", "true");
      navigate("/admin/dashboard");
    } else {
      alert("Usuário ou senha incorretos!");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Área Restrita</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Usuário"
          value={user}
          onChange={(e) => setUser(e.target.value)}
        />
        <br />
        <input
          type="password"
          placeholder="Senha"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
        />
        <br />
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}
