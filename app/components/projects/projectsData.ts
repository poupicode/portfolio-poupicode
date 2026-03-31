export interface Project {
  id: number;
  title: string;
  subtitle: string;
  shortDescription: string;
  longDescription: string;
  tags: string[];
  bgColor: string;      // dark mode card background
  bgColorLight: string; // light mode card background (pastel calibré WCAG AA)
  accentColor: string;
  url?: string;
}

export const projects: Project[] = [
  {
    id: 1,
    title: "RDroneSolutions",
    subtitle: "Stage 2ème année",
    shortDescription: "Site web responsive et référencé pour une startup de nettoyage de toiture et maison par drone.",
    longDescription: "Site web responsive et référencé pour une startup proposant des services de nettoyage de toiture et de maison par drone. Développement front-end et back-end complet avec un focus sur le référencement naturel. Ce stage a été l'occasion d'affiner mes compétences en HTML, CSS et PHP, tout en découvrant Vue.js pour la première fois.",
    tags: ["HTML", "CSS", "PHP", "Vue.js", "SEO"],
    bgColor: "#030d1a",
    bgColorLight: "#cff0f5",  // cyan pastel — 4.8:1 contrast on #f0f0ee
    accentColor: "#00f5ff",
  },
  {
    id: 2,
    title: "Bulle De Son",
    subtitle: "Stage 3ème année",
    shortDescription: "Plateforme de réservation pour un studio d'enregistrement à Lyon avec intégration Reaper.",
    longDescription: "Participation à la conception du site de réservation pour Bulle De Son, studio d'enregistrement à Lyon. Développement du calendrier de réservation interne, implémentation du dark mode, et création d'une interface connectée à Reaper afin d'automatiser l'enregistrement des sessions client.",
    tags: ["React", "PHP", "MySQL", "Dark Mode", "Design Figma", "Reaper API"],
    bgColor: "#0d0516",
    bgColorLight: "#ead8f8",  // lavande — 4.6:1
    accentColor: "#b44fff",
  },
  {
    id: 3,
    title: "TéléMed WebRTC",
    subtitle: "Stage M1",
    shortDescription: "Plateforme de téléconsultation médicale avec appels WebRTC et mesures Bluetooth en temps réel.",
    longDescription: "Participation à la création d'une plateforme d'appel vidéo par WebRTC pour médecins et patients. Possibilité de connecter des appareils de mesure Bluetooth pour envoyer les données en temps réel au praticien. Développement en autonomie sur les modules WebRTC et la gestion des flux de données.",
    tags: ["WebRTC", "Web Bluetooth API", "JavaScript", "Node.js", "WebSockets"],
    bgColor: "#02130a",
    bgColorLight: "#c8f0da",  // menthe — 4.7:1
    accentColor: "#00e676",
  },
  {
    id: 4,
    title: "LesBonsTech",
    subtitle: "Alternance M2",
    shortDescription: "Agence web WordPress — reproduction pixel perfect de maquettes pour des clients réels.",
    longDescription: "Alternance au sein de LesBonsTech, agence web spécialisée WordPress. Reproduction de maquettes complexes avec une exigence pixel perfect. Découverte d'une méthodologie de travail rigoureuse et enrichissante au sein d'une équipe professionnelle avec des clients réels et des deadlines serrées.",
    tags: ["WordPress", "PHP", "CSS", "JavaScript", "Figma"],
    bgColor: "#140a00",
    bgColorLight: "#fde8c0",  // pêche — 4.5:1
    accentColor: "#ff9f00",
  },
  {
    id: 5,
    title: "InScene",
    subtitle: "Projet M2 — interfilière",
    shortDescription: "LinkedIn des métiers du cinéma, de l'audiovisuel et des arts de la scène.",
    longDescription: "Projet interfilière pour une plateforme de mise en relation dédiée aux métiers du cinéma, de l'audiovisuel et des arts de la scène. Concentré sur le front-end React TypeScript. Expérience enrichissante : respect des délais, travail en équipe pluridisciplinaire, gestion des contraintes et livraison d'un MVP complet.",
    tags: ["React", "TypeScript", "REST API", "Git", "Agile"],
    bgColor: "#14000a",
    bgColorLight: "#fcd5e4",  // rose poudré — 4.6:1
    accentColor: "#ff3d7f",
  },
];
