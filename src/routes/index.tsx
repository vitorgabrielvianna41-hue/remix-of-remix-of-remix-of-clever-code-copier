import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";

import landingHtml from "../../public/mapa.html?raw";
import { CoverflowCarousel } from "@/components/ui/coverflow-carousel";
import kitMockupImg from "@/assets/kit-mockup-psi.webp";
import psiMapa2 from "@/assets/psi-mapa-2.webp";
import psiMapa3 from "@/assets/psi-mapa-3.webp";
import psiMapa4 from "@/assets/psi-mapa-4.webp";
import psiMapa5 from "@/assets/psi-mapa-5.webp";
import psiMapa6 from "@/assets/psi-mapa-6.webp";
import psiMapa7 from "@/assets/psi-mapa-7.webp";
import depoimento1 from "@/assets/depoimento-novo-8.webp";
import depoimento2 from "@/assets/depoimento-novo-9.webp";
import depoimento3 from "@/assets/depoimento-novo-7.webp";
import depoimento4 from "@/assets/depoimento-novo-10.webp";

import bonus1 from "@/assets/bonus-psi-1.webp";
import bonus2 from "@/assets/bonus-psi-2.webp";
import bonus3 from "@/assets/bonus-psi-3.webp";
import bonus4 from "@/assets/bonus-psi-4.webp";
import bonus5 from "@/assets/bonus-psi-5.webp";
import bonus6Asset from "@/assets/bonus-psi-6.png.asset.json";
import avatarRafael from "@/assets/avatar-rafael.webp";
import avatar1 from "@/assets/avatar-1.jpg";
import avatar2 from "@/assets/avatar-2.jpg";
import avatar3 from "@/assets/avatar-3.jpg";
import avatar4 from "@/assets/avatar-4.jpg";
import avatar5 from "@/assets/avatar-5.jpg";

const kitMockup = kitMockupImg;
const mapas = [
  psiMapa2,
  psiMapa3,
  psiMapa4,
  psiMapa5,
  psiMapa6,
  psiMapa7,
];
const bonusImgs = [bonus1, bonus2, bonus3, bonus4, bonus5, bonus6Asset.url];
const avatars = [avatar1, avatar2, avatar3, avatar4, avatar5];

// Cada depoimento tem sua própria foto de produto e seu próprio avatar,
// pareados para que a foto combine com o que a pessoa fala.
const depoimentos: Record<string, { produto: string; avatar: string }> = {
  mariana: { produto: depoimento4, avatar: avatars[0]! },
  camila: { produto: depoimento2, avatar: avatars[1]! },
  beatriz: { produto: depoimento1, avatar: avatars[2]! },
  patricia: { produto: depoimento3, avatar: avatarRafael },
};

const slides = [
  { src: psiMapa2, alt: "Mapa mental de História da Psicologia" },
  { src: psiMapa3, alt: "Mapa mental de Psicanálise — teorias de Freud" },
  { src: psiMapa4, alt: "Mapa mental de Behaviorismo e Aprendizagem" },
  { src: psiMapa5, alt: "Mapa mental de Psicologia Cognitiva" },
  { src: psiMapa6, alt: "Mapa mental de Psicologia Social" },
  { src: psiMapa7, alt: "Mapa mental de Neuropsicologia" },
];


function rewriteAssets(html: string) {
  return html
    // carregamento leve: imagens só quando aparecem na tela
    .replace(/<img(?![^>]*\bloading=)/gi, '<img loading="lazy" decoding="async"')
    .replace(/\/assets\/kit_mockup_v2\.webp/g, kitMockup)
    .replace(/\/assets\/mapa_preview_(\d)\.webp/g, (_m, n) => mapas[(Number(n) - 1) % mapas.length]!)
    .replace(/\/assets\/bonus_(\d)\.webp/g, (_m, n) => bonusImgs[(Number(n) - 1) % bonusImgs.length]!)
    .replace(
      /\/assets\/depoimento_(\w+)_produto\.webp/g,
      (_m, name: string) => depoimentos[name]?.produto ?? depoimento1,
    )
    .replace(
      /\/assets\/depoimento_(\w+)_avatar\.webp/g,
      (_m, name: string) => depoimentos[name]?.avatar ?? avatars[0]!,
    )
    .replace(
      /\/assets\/hero_avatar_(\d)\.webp/g,
      (_m, idx: string) => avatars[(Number(idx) - 1) % avatars.length]!,
    );
}


const rawBody = (landingHtml.match(/<body[^>]*>([\s\S]*)<\/body>/i)?.[1] ?? "")
  .replace(/<script[\s\S]*?<\/script>/gi, "")
  .trim();

// The dark "preview" section is replaced by the React coverflow carousel.
const previewSection = /<section class="section section--dark">[\s\S]*?<\/section>/i;
const match = rawBody.match(previewSection);
const splitIndex = match ? (match.index ?? 0) : rawBody.length;

const beforeHtml = rewriteAssets(rawBody.slice(0, splitIndex));
const afterHtml = rewriteAssets(rawBody.slice(splitIndex + (match?.[0].length ?? 0)));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kit de Psicologia Visual — +300 Mapas Mentais Imprimíveis" },
      {
        name: "description",
        content:
          "Estude psicologia de forma visual com mais de 300 mapas mentais imprimíveis. Da história das abordagens à clínica, revise rápido para provas e prática.",
      },
      { property: "og:title", content: "Kit de Psicologia Visual — +300 Mapas Mentais" },
      {
        property: "og:description",
        content:
          "Mais de 300 mapas mentais ilustrados de psicologia: história, psicanálise, behaviorismo, cognitiva, social, neuropsicologia e psicopatologia. Acesso vitalício.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Sora:wght@700;800;900&family=Manrope:wght@400;500;600;700;800&display=swap",
      },
      { rel: "stylesheet", href: "/style.css" },
    ],
  }),
  component: Index,
});

function useLandingScript() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    let cleanup: (() => void) | undefined;

    const run = () => {
      const init = (window as unknown as { initLanding?: (r: ParentNode) => (() => void) | void })
        .initLanding;
      if (init) cleanup = init(document) || undefined;
    };

    (window as unknown as { __LANDING_MANUAL_INIT__?: boolean }).__LANDING_MANUAL_INIT__ = true;

    if ((window as unknown as { initLanding?: unknown }).initLanding) {
      run();
    } else {
      const script = document.createElement("script");
      script.src = "/script.js";
      script.onload = run;
      document.body.appendChild(script);
    }

    return () => cleanup?.();
  }, []);

  return containerRef;
}

function Index() {
  const containerRef = useLandingScript();

  return (
    <div ref={containerRef}>
      <div dangerouslySetInnerHTML={{ __html: beforeHtml }} />

      <section className="section section--dark">
        <div className="container">
          <span className="section-label">O Material por Dentro</span>
          <h2 className="section-title" style={{ color: "#ffffff" }}>
            Veja como o material é por dentro
          </h2>
          <p className="section-subtitle">
            Mapas ilustrados e organizados por disciplina para facilitar seus estudos e revisões
            rápidas. Arraste para explorar.
          </p>

          <CoverflowCarousel
            slides={slides}
            cardWidth="clamp(230px, 68vw, 320px)"
            cardAspect={1}
            className="text-white"
            cardClassName="bg-white p-1"
            showNavigation
            showPagination
            label="Prévia dos mapas mentais"
          />

          <div style={{ textAlign: "center", marginTop: 40 }}>
            <a href="#value-stack-section" className="btn-cta">
              Quero Garantir Agora
            </a>
          </div>
        </div>
      </section>

      <div dangerouslySetInnerHTML={{ __html: afterHtml }} />
    </div>
  );
}
