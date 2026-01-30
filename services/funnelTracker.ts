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

    // LÓGICA DE BLOQUEIO INTELIGENTE
    // 1. Se explicitamente 'test', é teste.
    // 2. Se estiver em ambiente dev e NÃO explicitamente 'prod', é teste.
    if (mode === "test" || (this.isDevelopment() && mode !== "prod")) {
      return "Teste";
    }
    
    if (utmSource.includes("facebook") || utmSource.includes("fb")) return "Facebook";
    if (utmSource.includes("instagram") || utmSource.includes("ig")) return "Instagram";
    
    if (utmSource) return utmSource.charAt(0).toUpperCase() + utmSource.slice(1);
    
    return "Direto";
  }

  /**
   * Registra a etapa. Se estiver em modo teste ou ambiente dev, não envia para o Sheets.
   */
  async track(step: FunnelStep) {
    const source = this.getSource();
    
    if (source === "Teste") {
      console.info(`%c[FunnelTracker] AMBIENTE DE DEV DETECTADO: Registro de "${step}" apenas no console.`, "color: #FE2C55; font-weight: bold; background: #FFF0F0; padding: 2px 5px; border-radius: 4px;");
      return;
    }

    const payload = {
      userId: this.userId,
      step: step,
      source: source
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