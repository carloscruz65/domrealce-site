import { useLocation } from "wouter";

function Backlink() {
  const [location] = useLocation();

  // Não mostrar na home
  if (location === "/") return null;

  return (
    <a
      href="/"
      className="block text-sm text-gray-500 hover:text-gray-700 px-4 py-2"
    >
      ⬅ Voltar
    </a>
  );
}

export default Backlink;
