/**
 * FUNNEL TRACKER SERVICE
 * Envia dados para o Google Apps Script para persistência em planilha (One row per user).
 */

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzhbBm5xr_s8uEgcw-5HRljBXrwgSbLUiGEGcwrMmnyx3UKq3BiHSCmqJzq9vTv_YBe5w/exec";

export type FunnelStep = 
  | "ETAPA_1_CARREGOU_PAGINA"
  | "ETAPA_1_INICIOU_JORNADA"
  | "ETAPA_2_IDADE"
  | "ETAPA_3_ROTINA_ATUAL"
  | "ETAPA_3_VSL_CONCLUIDA"
  | "ETAPA_4_CONFLITOS"
  | "ETAPA_5_REACAO"
  | "ETAPA_6_SENTIMENTO_MAE"
  | "ETAPA_7_CLIMA_DA_CASA"
  | "ETAPA_8_FUTURO"
  | "ETAPA_9_PREVISIBILIDADE"
  | "ETAPA_10_TRANSICOES"
  | "ETAPA_11_CRENCIA"
  | "ETAPA_12_APRENDIZADO"
  | "ETAPA_13_SOLUCAO_VISUAL"
  | "ETAPA_14_PROCESSAMENTO"
  | "ETAPA_15_DIAGNOSTICO"
  | "ETAPA_16_CTA_PAGINA_VENDAS"
  | "ENTROU_PAGINA_VENDAS"
  | "CTA_COMPRA_CLICADO"
  | "CHECKOUT_INICIADO";

class FunnelTracker {
  private userId: string;

  constructor() {
    let id = localStorage.getItem('funnel_user_id');
    if (!id) {
      // Gera um UUID simples baseado em timestamp e aleatoriedade
      id = 'usr_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
      localStorage.setItem('funnel_user_id', id);
    }
    this.userId = id;
  }

  private getSource(): string {
    const urlParams = new URLSearchParams(window.location.search);
    const utmSource = urlParams.get('utm_source')?.toLowerCase() || "";
    const mode = urlParams.get('mode')?.toLowerCase() || "";

    if (mode === "test") return "Teste";
    
    if (utmSource.includes("facebook") || utmSource.includes("fb")) return "Facebook";
    if (utmSource.includes("instagram") || utmSource.includes("ig")) return "Instagram";
    
    if (utmSource) return utmSource.charAt(0).toUpperCase() + utmSource.slice(1);
    
    return "Direto";
  }

  // Fixing type error by ensuring FunnelStep union includes all used values
  async track(step: FunnelStep) {
    const source = this.getSource();
    
    const payload = {
      userId: this.userId,
      step: step,
      source: source
    };

    try {
      // Envia via POST (no-cors é necessário para Google Apps Script)
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