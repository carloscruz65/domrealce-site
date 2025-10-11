import { useQuery } from "@tanstack/react-query";
import type { Slide } from "@shared/schema";

interface SliderResponse {
  slides: Slide[];
}

export default function AdminSlider() {
  const { data, isLoading, error } = useQuery<SliderResponse>({
    queryKey: ["/api/admin/slider"],
    queryFn: async () => {
      const res = await fetch("/api/admin/slider", {
        headers: {
          "x-admin-token": "domrealce2460" // 
        }
      });
      if (!res.ok) throw new Error("Erro ao carregar slides");
      return res.json();
    }
  });

  if (isLoading) return <p>A carregar…</p>;
  if (error) return <p>Erro ao carregar slides</p>;

  return (
    <div>
      <h2>Slides ativos</h2>
      <ul>
        {data?.slides.map((slide) => (
          <li key={slide.id}>{slide.title}</li>
        ))}
      </ul>
    </div>
  );
}