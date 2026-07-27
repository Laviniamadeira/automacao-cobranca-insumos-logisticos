// 🤖 4. MOTOR PRINCIPAL DE EXECUÇÃO
// ==============================================================================

function dispararMensal() { iniciarDisparo("MENSAL", false); }
function dispararSemanal() { iniciarDisparo("SEMANAL", false); }
function dispararTesteMensal() { iniciarDisparo("MENSAL", true); }
function dispararTesteSemanal() { iniciarDisparo("SEMANAL", true); }

function iniciarDisparo(tipoDisparo, modoTeste) {
  var planilhaAtual = SpreadsheetApp.getActiveSpreadsheet();
  var ui = SpreadsheetApp.getUi();

  var aba = planilhaAtual.getSheetByName(NOME_ABA_UNICA);

  if (!aba) {
    ui.alert("❌ Erro: Não encontrei a aba chamada '" + NOME_ABA_UNICA + "'. Verifique o nome nas configurações.");
    return;
  }

  var periodoApuracao = aba.getRange(CELULA_PERIODO).getDisplayValue();
  var dataLimiteMensal = aba.getRange(CELULA_LIMITE).getDisplayValue();

  var ultimaLinha = aba.getLastRow();
  var linhasValidas = [];

  if (modoTeste) {
    // No modo teste, busca até 3 exemplos representativos: um com pendência
    // só de sacas, um só de gaylords, e um com ambos — assim o teste cobre
    // os principais cenários de e-mail em uma única execução.
    var testeAmbos = null, testeSoSacas = null, testeSoGaylords = null;

    for (var i = LINHA_INICIO_DADOS; i <= ultimaLinha; i++) {
      var nome = aba.getRange(i, COL_NOME_LEVE).getValue();
      var valorTotal = aba.getRange(i, COL_PENDENCIA).getValue();
      var statusAtual = aba.getRange(i, COL_STATUS).getValue();

      if (nome !== "" && valorTotal > 0 && statusAtual.indexOf("ENVIADO") === -1) {
        var sPen = Number(aba.getRange(i, COL_SACAS_PEN).getValue());
        var gPen = Number(aba.getRange(i, COL_GAY_PEN).getValue());

        if (sPen > 0 && gPen > 0 && !testeAmbos) testeAmbos = i;
        else if (sPen > 0 && gPen === 0 && !testeSoSacas) testeSoSacas = i;
        else if (sPen === 0 && gPen > 0 && !testeSoGaylords) testeSoGaylords = i;

        if (testeAmbos && testeSoSacas && testeSoGaylords) break;
      }
    }

    if (testeAmbos) linhasValidas.push(testeAmbos);
    if (testeSoSacas) linhasValidas.push(testeSoSacas);
    if (testeSoGaylords) linhasValidas.push(testeSoGaylords);

    if (linhasValidas.length === 0) {
      ui.alert("⚠️ Teste cancelado: nenhuma base elegível encontrada (sem pendência ou já enviadas).");
      return;
    }
  } else {
    for (var i = LINHA_INICIO_DADOS; i <= ultimaLinha; i++) {
      var nome = aba.getRange(i, COL_NOME_LEVE).getValue();
      var valorTotal = aba.getRange(i, COL_PENDENCIA).getValue();
      var statusAtual = aba.getRange(i, COL_STATUS).getValue();

      if (nome !== "" && valorTotal > 0 && statusAtual.indexOf("ENVIADO") === -1) {
        linhasValidas.push(i);
      }
    }
  }

  // 📎 Busca os anexos uma única vez, fora do loop de envio (mais eficiente)
  var listaAnexos = buscarAnexos();

  for (var j = 0; j < linhasValidas.length; j++) {
    var linha = linhasValidas[j];
    var nomeParceiro = aba.getRange(linha, COL_NOME_LEVE).getValue();
    var emailParceiro = aba.getRange(linha, COL_EMAIL).getValue().toString().replace(/;/g, ",").replace(/\s/g, "");

    var sEnv = aba.getRange(linha, COL_SACAS_ENV).getValue();
    var sDev = aba.getRange(linha, COL_SACAS_DEV).getValue();
    var sPen = aba.getRange(linha, COL_SACAS_PEN).getValue();
    var vSac = aba.getRange(linha, COL_VALOR_SAC).getValue();
    var gEnv = aba.getRange(linha, COL_GAY_ENV).getValue();
    var gDev = aba.getRange(linha, COL_GAY_DEV).getValue();
    var gPen = aba.getRange(linha, COL_GAY_PEN).getValue();
    var vGay = aba.getRange(linha, COL_VALOR_GAY).getValue();
    var total = aba.getRange(linha, COL_PENDENCIA).getValue();

    var assunto = (tipoDisparo === "MENSAL")
      ? montarAssuntoMensal(nomeParceiro, periodoApuracao)
      : montarAssuntoSemanal(nomeParceiro);
    var corpoEmail = montarCorpoDoEmail(tipoDisparo, nomeParceiro, periodoApuracao, dataLimiteMensal, sEnv, sDev, sPen, vSac, gEnv, gDev, gPen, vGay, total, LINK_FORMULARIO);

    var pacoteDeEnvio = {
      to: modoTeste ? MEU_EMAIL_DE_TESTE : emailParceiro,
      cc: modoTeste ? "" : EMAILS_COM_COPIA,
      subject: (modoTeste ? "[TESTE] " : "") + assunto,
      htmlBody: corpoEmail,
      name: "Operações - Insumos"
    };

    if (listaAnexos.length > 0) { pacoteDeEnvio.attachments = listaAnexos; }

    try {
      MailApp.sendEmail(pacoteDeEnvio);
      var textoStatus = tipoDisparo === "MENSAL" ? "ENVIADO (MENSAL)" : "ENVIADO (LEMBRETE)";
      aba.getRange(linha, COL_STATUS).setValue((modoTeste ? "TESTE " : "") + textoStatus);
    } catch (e) {
      aba.getRange(linha, COL_STATUS).setValue("ERRO");
    }
  }

  if (!modoTeste) { ui.alert("Concluído! 🚀 O disparo selecionado foi finalizado."); }
}

// Busca os PDFs de anexo no Google Drive a partir dos IDs configurados.
// Se algum ID não estiver preenchido ou o arquivo não for encontrado,
// simplesmente ignora esse anexo (não quebra o envio do e-mail).
function buscarAnexos() {
  var anexos = [];
  var idsAnexos = [ID_PDF_ANEXO_1, ID_PDF_ANEXO_2];

  idsAnexos.forEach(function (id) {
    if (id && id !== "ID_DO_ARQUIVO_AQUI") {
      try {
        anexos.push(DriveApp.getFileById(id).getBlob());
      } catch (e) {
        // Arquivo não encontrado ou sem permissão de acesso; segue sem esse anexo
      }
    }
  });

  return anexos;
}
