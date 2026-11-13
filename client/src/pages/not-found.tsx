import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black text-white">
      <Card className="w-full max-w-md mx-4 bg-[#111] border-white/10 text-white">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2">
            <AlertCircle className="h-8 w-8 text-brand-yellow" />
            <h1 className="text-2xl font-bold text-white">Página não encontrada</h1>
          </div>

          <p className="mt-4 text-sm text-gray-300">
            A página que procura não existe ou foi movida.
          </p>
          <div className="flex flex-wrap gap-6 mt-6 text-brand-yellow underline">
            <Link href="/">Voltar ao início</Link>
            <Link href="/servicos">Ver serviços</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

