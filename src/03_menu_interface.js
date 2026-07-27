// 🚀 3. MENU CUSTOMIZADO NA PLANILHA (INTERFACE DE USUÁRIO - UI)
// ==============================================================================

function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('🚀 Robô de Cobrança')
    .addItem('📅 Disparar E-mails (MENSAL)', 'dispararMensal')
    .addItem('⚠️ Disparar E-mails (SEMANAL)', 'dispararSemanal')
    .addSeparator()
    .addItem('🧪 Teste Aleatório (MENSAL)', 'dispararTesteMensal')
    .addItem('🧪 Teste Aleatório (SEMANAL)', 'dispararTesteSemanal')
    .addToUi();
}
