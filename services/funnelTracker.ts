
/**
 * FUNNEL TRACKER SERVICE
 * Envia dados para o Google Apps Script para persistência em planilha.
 */

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzhbBm5xr_s8uEgcw-5HRljBXrwgSbLUiGEGcwrMmnyx3UKq3BiHSCmqJzq9vTv_YBe5w/exec";

export type FunnelStep = 
  | "ETAPA_1_CARREGOU_PAGINA"
  | "ETAPA_1_INICIOU_JORNADA"
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
  | "ENTROU_PAGINA_VENDAS"
  | "VSL_RESPOSTA_RECONHECIMENTO"
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
  | "DIAGNOSTICO_ACESSO"
  | "DIAGNOSTICO_RASPADINHA_REVELADA"
  | "DIAGNOSTICO_CLICOU_CHECKOUT"
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
    return window.location.hostname === 'localhost' || window.location.hostname.includes('stackblitz');
  }

  private getSource(): string {
    const urlParams = new URLSearchParams(window.location.search);
    const utmSource = urlParams.get('utm_source')?.toLowerCase() || "";
    if (utmSource.includes("facebook") || utmSource.includes("fb")) return "Facebook";
    if (utmSource.includes("instagram") || utmSource.includes("ig")) return "Instagram";
    return utmSource || "Direto";
  }

  updateLeadInfo(name: string, email: string, phone: string) {
    localStorage.setItem('funnel_lead_name', name);
    localStorage.setItem('funnel_lead_email', email);
    localStorage.setItem('funnel_lead_phone', phone);
    console.log("[FunnelTracker] Dados do lead atualizados localmente.");
  }

  private getLeadData() {
    return {
      name: localStorage.getItem('funnel_lead_name') || "",
      email: localStorage.getItem('funnel_lead_email') || "",
      phone: localStorage.getItem('funnel_lead_phone') || ""
    };
  }

  async track(step: FunnelStep, data?: string) {
    const source = this.getSource();
    const lead = this.getLeadData();
    
    const payload = {
      userId: this.userId,
      step: step,
      data: data || "", 
      source: source,
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      timestamp: new Date().toISOString()
    };

    console.info(`[FunnelTracker] Enviando: ${step} | Dado: ${data || 'N/A'}`);

    try {
      // Usamos text/plain para evitar pre-flight OPTIONS que falham no Google Apps Script com no-cors
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      console.warn("[FunnelTracker] Erro silencioso ao trackear:", error);
    }
  }
}

export const funnelTracker = new FunnelTracker();
