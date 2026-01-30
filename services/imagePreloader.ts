/**
 * IMAGE PRELOADER SERVICE
 * Carrega as imagens em segundo plano assim que o app inicia.
 */

const IMAGES_TO_PRELOAD = [
  // Quiz - Opções de Idade
  "https://raw.githubusercontent.com/kayosilvavinicius-prog/FILHOS-COM-ROTINA-quiz-/003b34385a2ab02007ebe5b919fcf5abe9a5cdb7/2%20a%204%20anos.png",
  "https://raw.githubusercontent.com/kayosilvavinicius-prog/FILHOS-COM-ROTINA-quiz-/003b34385a2ab02007ebe5b919fcf5abe9a5cdb7/5%20a%207%20anos.png",
  "https://raw.githubusercontent.com/kayosilvavinicius-prog/FILHOS-COM-ROTINA-quiz-/003b34385a2ab02007ebe5b919fcf5abe9a5cdb7/8%20a%2010%20anos.png",
  
  // Imagens Informativas e de Processamento
  "https://raw.githubusercontent.com/kayosilvavinicius-prog/FILHOS-COM-ROTINA-quiz-/25ea3c03a78fb758ada36f9f68ed5ed31957f3e9/Gemini_Generated_Image_bwp8yubwp8yubwp8.png",
  "https://raw.githubusercontent.com/kayosilvavinicius-prog/FILHOS-COM-ROTINA/f3a64c152a91eb1ab2000ecf39405c8686bd54c9/Expert%20aline.png",
  
  // Imagens do Diagnóstico (Antes e Depois)
  "https://raw.githubusercontent.com/kayosilvavinicius-prog/FILHOS-COM-ROTINA-quiz-/45b6d41935979ee738350aed1a78aa0a3090aac4/ANTES.png",
  "https://raw.githubusercontent.com/kayosilvavinicius-prog/FILHOS-COM-ROTINA-quiz-/45b6d41935979ee738350aed1a78aa0a3090aac4/DEPOIS.png",
  
  // Missões (WhatsApp / Ligação)
  "https://raw.githubusercontent.com/kayosilvavinicius-prog/FILHOS-COM-ROTINA/33b5814f67fd820ca815cac9094f790e29102d28/ALINE%20WHATSAPP.jpg",
  "https://w0.peakpx.com/wallpaper/580/624/HD-wallpaper-whatsapp-background-dark-pattern-whatsapp-doodle-doodle-art.jpg"
];

export const preloadFunnelImages = () => {
  if (typeof window === 'undefined') return;
  
  IMAGES_TO_PRELOAD.forEach((url) => {
    const img = new Image();
    img.src = url;
  });
  
  console.info("[ImagePreloader] Iniciando pré-carregamento de ativos críticos...");
};