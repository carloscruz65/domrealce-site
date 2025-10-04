import { useState } from "react";
import { useLocation } from "wouter";

export default function Login() {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [, setLocation] = useLocation();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (user === "admin" && pass === "1234") {
      localStorage.setItem("auth", "true");
      setLocation("/admin"); // redireciona para o dashboard
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
