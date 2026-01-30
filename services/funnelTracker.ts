/**
 * FUNNEL TRACKER SERVICE
 * Envia dados para o Google Apps Script para persistência em planilha.
 */

// URL do Google Apps Script configurada
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwhj9GqSsO1DWX9jRfckLTOfKG23knzzgI00ElHBp_tKR98XuucrTXBAyhwc4gkeJn6ew/exec";

export type FunnelStep = 
  | "ETAPA_0_ENTROU_FUNIL"
  | "ETAPA_1_WHATSAPP"
  | "ETAPA_2_LIGACAO"
  | "ETAPA_3_VSL_INICIADA"
  | "ETAPA_3_VSL_CONCLUIDA"
  | "ETAPA_4_PAGINA_VENDAS"
  | "CTA_PAGINA_VENDAS"
  | "MODAL_CAPTURA_PREENCHIDO"
  | "CHECKOUT_INICIADO";

class FunnelTracker {
  private userId: string;

  constructor() {
    // Recupera ou gera ID único persistente para o usuário
    let id = localStorage.getItem('funnel_user_id');
    if (!id) {
      id = 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
      localStorage.setItem('funnel_user_id', id);
    }
    this.userId = id;
  }

  /**
   * Identifica se a sessão atual é de teste baseado na URL
   */
  private isTestMode(): boolean {
    const params = new URLSearchParams(window.location.search);
    return params.get('s') === 'test' || params.get('mode') === 'test';
  }

  private getSource(): string {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('utm_source') || urlParams.get('source') || "Direto";
  }

  /**
   * Envia o passo do funil para o Google Sheets
   */
  async track(step: FunnelStep) {
    const isTest = this.isTestMode();
    console.log(`[FunnelTracker] ${isTest ? '🧪 TESTE' : '🚀 REAL'} - Tracking: ${step}`);
    
    const payload = {
      userId: this.userId,
      step: step,
      source: this.getSource()
    };

    // Anexa parâmetro de teste na URL para o Google Apps Script identificar via e.parameter
    const urlWithParams = new URL(SCRIPT_URL);
    if (isTest) {
      urlWithParams.searchParams.append('s', 'test');
    }

    try {
      // Usando mode: 'no-cors' para evitar problemas de Cross-Origin com o endpoint do Google Apps Script
      // No modo 'no-cors', o corpo é enviado mas não podemos ler a resposta.
      fetch(urlWithParams.toString(), {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }).catch(err => console.warn("[FunnelTracker] Silently failed fetch (expected in no-cors):", err));
    } catch (error) {
      console.error("[FunnelTracker] Error initiating track request:", error);
    }
  }
}

export const funnelTracker = new FunnelTracker();