# Brainstorming de Design - Bolsonier Store

## Abordagem 1: Neo-Graffiti Urbano (Probabilidade: 0.08)

**Design Movement:** Pichação digital + design gráfico contemporâneo com raízes no street art brasileiro

**Core Principles:**
- Tipografia ousada e distorcida como elemento principal, não apenas suporte
- Camadas visuais que simulam sobreposição de intervenções urbanas
- Contraste extremo entre espaços vazios (branco) e elementos gráficos densos
- Movimento visual que guia o olho como em um mural planejado

**Color Philosophy:**
Rosa choque como cor de impacto emocional (energia, provocação, desejo). Verde ácido como cor secundária de contraste (vitalidade, rebeldia). Preto como estrutura e peso. Branco dominante como respiro e sofisticação. A paleta evoca pichação urbana contemporânea, não patriotismo.

**Layout Paradigm:**
Assimétrico com blocos de conteúdo que se sobrepõem. Uso de diagonais, ângulos cortados e composições que quebram a simetria. Seções com clipping paths que criam formas geométricas inesperadas. Navegação integrada visualmente como parte da composição, não separada.

**Signature Elements:**
- Tipografia com distorção/skew aplicada dinamicamente
- Linhas grossas em rosa/verde que cortam a página
- Elementos de pichação (tags, splashes) como decoração estratégica
- Blocos de cor sólida com bordas cortadas em ângulos

**Interaction Philosophy:**
Interações que revelam camadas. Hover states que expõem elementos ocultos. Transições que simulam pinceladas ou revelação de pichação. Cada clique sente-se como descobrir algo novo em um mural.

**Animation:**
- Entrance: elementos aparecem com stroke animation (como sendo desenhados)
- Hover: linhas se expandem, cores mudam com efeito de "pintura molhada"
- Transitions: 200-300ms com easing forte (cubic-bezier(0.23, 1, 0.32, 1))
- Scroll: elementos se revelam com parallax assimétrico

**Typography System:**
- Display: Fonte sans-serif bold/black (ex: Bebas Neue, Space Mono Bold) com 15-20% de skew
- Heading: Mesma família, weight 700-900, sem distorção
- Body: Fonte sans-serif clean (ex: Inter, Roboto) em weight 400-500 para legibilidade
- Hierarchy: Tamanho extremo (H1: 72-96px), contraste de peso, não apenas cor

---

## Abordagem 2: Minimalismo Urbano Premium (Probabilidade: 0.07)

**Design Movement:** Luxury streetwear meets Swiss design rigor

**Core Principles:**
- Tipografia refinada e espaçada, cada caractere respirando
- Uso de espaço negativo como elemento de design, não desperdício
- Paleta limitada aplicada com precisão cirúrgica
- Estrutura grid-based mas com quebras estratégicas para dinamismo

**Color Philosophy:**
Branco como protagonista (sofisticação, espaço). Rosa choque em pequenas doses (pontos de atenção, CTA). Verde ácido em acenos sutis (detalhe, hover states). Preto para tipografia e estrutura. Abordagem: menos é mais, cada cor tem propósito.

**Layout Paradigm:**
Grid limpo com margens generosas. Seções com breathing room. Tipografia grande e espaçada como elemento visual. Produtos destacados com espaço ao redor, não aglomerados. Navegação limpa e intuitiva, não decorativa.

**Signature Elements:**
- Tipografia grande e elegante como protagonista
- Linhas finas em rosa/verde como divisores
- Fotografia de produto clean com fundo branco
- Números e detalhes em verde ácido como acentos

**Interaction Philosophy:**
Interações suaves e previsíveis. Hover states que revelam informação, não que distraem. Transições smooth que não chamam atenção. Foco total no conteúdo e na conversão.

**Animation:**
- Entrance: fade in suave (300ms)
- Hover: subtle scale (1.02) com fade de cor
- Transitions: 200ms ease-out
- Scroll: fade in gradual, sem parallax

**Typography System:**
- Display: Fonte serif elegante (ex: Playfair Display) em 64-80px, weight 700
- Heading: Mesma serif, weight 600, 32-48px
- Body: Sans-serif clean (ex: Inter) em 16px, weight 400
- Hierarchy: Peso, tamanho, espaçamento (não cor)

---

## Abordagem 3: Brutalism Digital Contemporâneo (Probabilidade: 0.06)

**Design Movement:** Brutalism digital + design gráfico de cartaz dos anos 80/90

**Core Principles:**
- Formas geométricas pesadas e intencionais
- Tipografia grande, pesada, quase agressiva
- Texturas e padrões que adicionam dimensão
- Composição que desafia convenções de web design

**Color Philosophy:**
Contraste máximo: branco e preto como base estrutural. Rosa choque e verde ácido como cores de impacto que brigam pelo espaço. Paleta deliberadamente tensa e provocadora. Sensação de força e presença.

**Layout Paradigm:**
Blocos pesados e bem definidos. Tipografia que ocupa espaço. Imagens grandes e impactantes. Navegação como elemento gráfico integrado. Composição que lembra cartazes e pôsteres, não sites convencionais.

**Signature Elements:**
- Blocos de cor sólida com bordas bem definidas
- Tipografia pesada e distorcida
- Padrões geométricos (linhas, pontos, grades)
- Elementos de cartaz (frames, borders, sombras)

**Interaction Philosophy:**
Interações que têm peso e consequência. Cliques que sentem-se definitivos. Hover states que mudam radicalmente, não sutilmente. Cada interação comunica força.

**Animation:**
- Entrance: scale from 0.9 com opacity, 250ms
- Hover: color invert ou scale 1.05 com shadow
- Transitions: 180-250ms cubic-bezier(0.23, 1, 0.32, 1)
- Scroll: elementos aparecem com movimento de entrada

**Typography System:**
- Display: Fonte sans-serif ultra-bold (ex: Bebas Neue, Oswald Black) em 80-100px
- Heading: Mesma família, weight 900, 48-64px
- Body: Sans-serif medium (ex: Inter Medium) em 16px, weight 500
- Hierarchy: Peso extremo, tamanho grande, contraste de cor

---

## Decisão: Abordagem Escolhida

**Selecionado: Neo-Graffiti Urbano**

Esta abordagem melhor captura a essência da marca Bolsonier Store: autoral, urbana, contemporânea, com presença visual marcante. A combinação de tipografia ousada, sobreposição de camadas visuais e uso estratégico de pichação digital cria uma identidade que não é genérica nem minimalista neutra. É uma marca que respira força, conceito e desejo.

A paleta rosa choque + verde ácido + branco + preto é vibrante, urbana e premium simultaneamente. A tipografia distorcida e as linhas cortadas criam dinamismo. As interações que revelam camadas fazem o site sentir-se vivo e exploratório, como descobrir um mural novo na cidade.

Evita completamente estética patriótica, aparência infantil ou excessivamente clean. Comunica: força, autoria, urbanidade, premiumidade, vivacidade, contemporaneidade.
