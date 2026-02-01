
/**
 * FUNNEL TRACKER SERVICE
 * Envia dados para o Google Apps Script para persistência em planilha.
 */

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzhbBm5xr_s8uEgcw-5HRljBXrwgSbLUiGEGcwrMmnyx3UKq3BiHSCmqJzq9vTv_YBe5w/exec";

export type FunnelStep = 
  // Etapas Iniciais (Quiz Antigo / Jornada)
  | "ETAPA_1_CARREGOU_PAGINA"
  | "ETAPA_1_INICIOU_JORNADA"
  | "ETAPA_2_IDADE"
  | "ETAPA_3_ROTINA_ATUAL"
  | "ETAPA_4_CONFLITOS"
  | "ETAPA_5_REACAO"
  | "ETAPA_6_SENTIMENTO_MAE"
  | "ETAPA_7_CLIMA_DA_CASA"
  | "ETAPA_8_FUTURO"
  | "ETAPA_9_PREVISIBILIDADE"
  | "ETAPA_10_TRANSICOES"
  | "ETAPA_11_CRENCIA"
  | "ETAPA_13_SOLUCAO_VISUAL"
  | "ETAPA_14_PROCESSAMENTO"
  | "ETAPA_15_DIAGNOSTICO"
  | "ETAPA_16_CTA_PAGINA_VENDAS"
  
  // Novas Etapas Estratégicas (VSL Interativa na SalesPage)
  | "ENTROU_PAGINA_VENDAS"
  | "VSL_RESPOSTA_IDADE"
  | "VSL_RESPOSTA_ROTINA"
  | "VSL_RESPOSTA_REACAO"
  | "VSL_RESPOSTA_SENTIMENTO"
  | "VSL_RESPOSTA_CLIMA"
  | "VSL_RESPOSTA_FUTURO"
  | "VSL_RESPOSTA_APRENDIZADO"
  | "VSL_RESPOSTA_CRENCA"
  | "VSL_VIDEO_CONCLUIDO"
  | "VSL_CLICOU_VER_DIAGNOSTICO"
  | "ETAPA_3_VSL_CONCLUIDA"
  
  // Etapas da Página de Diagnóstico
  | "DIAGNOSTICO_ACESSO"
  | "DIAGNOSTICO_RASPADINHA_REVELADA"
  | "DIAGNOSTICO_CLICOU_CHECKOUT"
  
  // Checkout
  | "CHECKOUT_INICIADO";

class FunnelTracker {
  private userId: string;

  constructor() {
    let id = localStorage.getItem('funnel_user_id');
    if (!id) {
      id = 'usr_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
      localStorage.setItem('funnel_user_id', id);
    }
    this.userId = id;
  }

  private isDevelopment(): boolean {
    const hostname = window.location.hostname;
    return (
      hostname === 'localhost' || 
      hostname === '127.0.0.1' || 
      hostname.includes('.preview.') || 
      hostname.includes('stackblitz') ||
      hostname.includes('webcontainer')
    );
  }

  private getSource(): string {
    const urlParams = new URLSearchParams(window.location.search);
    const utmSource = urlParams.get('utm_source')?.toLowerCase() || "";
    const mode = urlParams.get('mode')?.toLowerCase() || "";

    if (mode === "test" || (this.isDevelopment() && mode !== "prod")) {
      return "Teste";
    }
    
    if (utmSource.includes("facebook") || utmSource.includes("fb")) return "Facebook";
    if (utmSource.includes("instagram") || utmSource.includes("ig")) return "Instagram";
    if (utmSource) return utmSource.charAt(0).toUpperCase() + utmSource.slice(1);
    
    return "Direto";
  }

  async track(step: FunnelStep) {
    const source = this.getSource();
    
    if (source === "Teste") {
      console.info(`%c[FunnelTracker] TRACK: ${step}`, "color: #FE2C55; font-weight: bold;");
      return;
    }

    const payload = {
      userId: this.userId,
      step: step,
      source: source,
      timestamp: new Date().toISOString()
    };

    try {
      fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      console.warn("[FunnelTracker] Silent Error:", error);
    }
  }
}

export const funnelTracker = new FunnelTracker();
