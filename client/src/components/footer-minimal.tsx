// components/footer-minimal.tsx

export default function FooterMinimal() {
  return (
    <footer className="py-6 bg-black border-t border-white/5 text-center text-xs text-gray-500">
      © {new Date().getFullYear()} DOMREALCE · Paredes · Grande Porto
    </footer>
  );
}
