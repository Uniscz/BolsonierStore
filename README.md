# Bolsonier Store

E-commerce de streetwear autoral com foco em coleções sob demanda e design urbano.

## Stack

- **Frontend**: React 19 + Tailwind CSS 4 + TypeScript
- **Routing**: Wouter (client-side)
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Typography**: Bebas Neue (display) + Inter (body)

## Estrutura do Projeto

```
client/
  public/       ← Arquivos de configuração (favicon, robots.txt)
  src/
    pages/      ← Páginas do site
    components/ ← Componentes reutilizáveis
    contexts/   ← React contexts
    hooks/      ← Custom hooks
    lib/        ← Utilitários
    App.tsx     ← Rotas principais
    main.tsx    ← Entry point
    index.css   ← Estilos globais
```

## Páginas

- **Home** - Página inicial com hero "O Pix é Nosso"
- **Loja** - Grid de produtos com filtros
- **Coleção** - Página de coleção autoral
- **Sobre** - Informações da marca
- **Contato** - Formulário de contato
- **FAQ** - Perguntas frequentes
- **Páginas Legais** - Políticas e termos

## Design

**Identidade Visual**: Neo-Graffiti Urbano
- Cores: Rosa Choque (#FF006E) + Verde Ácido (#CCFF00) + Preto + Branco
- Tipografia: Bebas Neue (títulos distorcidos) + Inter (corpo)
- Efeitos: Text shadows em camadas, skew transform, tracking agressivo

## Scripts

```bash
npm run dev      # Iniciar dev server
npm run build    # Build para produção
npm run check    # Verificar tipos TypeScript
npm run format   # Formatar código
```

## Deployment

O projeto está pronto para deploy em Vercel, Netlify ou qualquer plataforma que suporte React estático.

## Licença

MIT
