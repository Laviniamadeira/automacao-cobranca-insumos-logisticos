/**
 * ==============================================================================
 * PROJETO: Automação de Faturamento e Cobrança com Google Apps Script
 * AUTORA: Lavínia Madeira
 *
 * OBS: Dados sensíveis (e-mails internos, IDs de arquivos, nome da empresa,
 * link do formulário) foram substituídos por valores genéricos para fins
 * de portfólio.
 * ==============================================================================
 */

// ⚙️ 1. CONFIGURAÇÕES GERAIS DA AUTOMAÇÃO (VERSÃO PORTFÓLIO / GENÉRICA)
// ==============================================================================

var NOME_ABA_UNICA = "Disparo E-mails";

var MEU_EMAIL_DE_TESTE = "analista.dados@exemplo.com";
var EMAILS_COM_COPIA = "financeiro@exemplo.com, logistica@exemplo.com";
var LINK_FORMULARIO = "https://forms.google.com/exemplo";

// IDs de arquivos no Google Drive (exemplos)
var ID_PDF_ANEXO_1 = "ID_DO_ARQUIVO_AQUI"; // Padrão de Envio de Insumos
var ID_PDF_ANEXO_2 = "ID_DO_ARQUIVO_AQUI"; // Modelo de Identificação

// Posições de células e linha inicial dos dados
var CELULA_PERIODO = "B1";
var CELULA_LIMITE = "E1";
var LINHA_INICIO_DADOS = 4;

// 🗺️ Mapeamento das colunas
var COL_NOME_LEVE = 2;   // B: Nome do Parceiro (Leve)
var COL_SACAS_ENV = 4;   // D: Sacas Enviadas
var COL_SACAS_DEV = 5;   // E: Sacas Devolvidas
var COL_SACAS_PEN = 6;   // F: Sacas Pendentes
var COL_VALOR_SAC = 7;   // G: Custo Sacas
var COL_GAY_ENV   = 8;   // H: Gaylords Enviados
var COL_GAY_DEV   = 9;   // I: Gaylords Devolvidos
var COL_GAY_PEN   = 10;  // J: Gaylords Pendentes
var COL_VALOR_GAY = 11;  // K: Custo Gaylords
var COL_PENDENCIA = 12;  // L: Total Pendente
var COL_EMAIL     = 13;  // M: E-mail Financeiro
var COL_STATUS    = 14;  // N: Status do E-mail

var PRECO_UNIT_SACA = 3.90;
var PRECO_UNIT_GAYLORD = 48.66;
