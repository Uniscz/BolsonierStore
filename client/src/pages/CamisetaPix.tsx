import { useEffect } from "react";
import { useLocation } from "wouter";

// Redireciona /camiseta-pix para /produto/camiseta-pix
export default function CamisetaPix() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    setLocation("/produto/camiseta-pix", { replace: true });
  }, [setLocation]);

  return null;
}
