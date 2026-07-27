// 📝 2. GERAÇÃO DINÂMICA DE HTML PARA E-MAILS
// ==============================================================================

function montarAssuntoMensal(nomeParceiro, periodo) {
  return "[EMPRESA] Notificação de cobrança de Insumos – " + nomeParceiro + " | Período: " + periodo;
}

function montarAssuntoSemanal(nomeParceiro) {
  return "[EMPRESA] Notificação de acompanhamento de Insumos – " + nomeParceiro;
}

function montarCorpoDoEmail(tipoDisparo, nomeParceiro, periodo, dataLimite, sEnv, sDev, sPen, valSac, gEnv, gDev, gPen, valGay, total, linkForms) {
  var html = "";

  html += "Olá! <b>" + nomeParceiro + "</b><br><br>";
  html += "Este é um comunicado sobre o acompanhamento dos insumos de propriedade da empresa (sacas, gaylords e paletes) enviados às bases parceiras. Ao longo do período, realizamos monitoramentos e consolidamos os volumes enviados e devolvidos para identificar possíveis pendências de devolução.<br><br>";
  html += "Para o período de <b>" + periodo + "</b>, identificamos os seguintes resultados:<br><br>";

  var insumosPendentes = [];

  html += "<table border='1' cellpadding='8' cellspacing='0' style='border-collapse: collapse; width: 100%; max-width: 700px; text-align: center; font-family: Arial, sans-serif; font-size: 14px; border-color: #ddd;'>";
  html += "<tr style='background-color: #00AFFF; color: #FFFFFF;'>";
  html += "<th>Insumo</th><th>Enviados</th><th>Devolvidos</th><th>Pendentes</th><th>Valor Unit.</th><th>Total Pendente</th>";
  html += "</tr>";

  if (sPen > 0) {
    html += "<tr><td><b>Sacas</b></td><td>" + sEnv + "</td><td>" + sDev + "</td><td><b style='color: #d93025;'>" + sPen + "</b></td><td>R$ 3,90</td><td><b>" + formatarMoeda(valSac) + "</b></td></tr>";
    insumosPendentes.push("Sacas");
  }
  if (gPen > 0) {
    html += "<tr><td><b>Gaylords</b></td><td>" + gEnv + "</td><td>" + gDev + "</td><td><b style='color: #d93025;'>" + gPen + "</b></td><td>R$ 48,66</td><td><b>" + formatarMoeda(valGay) + "</b></td></tr>";
    insumosPendentes.push("Gaylords");
  }
  html += "</table><br>";

  var textoDinamico = insumosPendentes.join(" & ");
  html += "💰 Valor total pendente de devolução (" + textoDinamico + "): <b>" + formatarMoeda(total) + "</b><br>";

  // 🛡️ Caixinha de alerta (apenas para o disparo MENSAL, que é a cobrança final)
  if (tipoDisparo === "MENSAL") {
    html += "<div style='background-color: #f4fafd; border-left: 4px solid #00AFFF; padding: 12px; max-width: 676px; margin-top: 15px; margin-bottom: 5px; font-family: Arial, sans-serif; font-size: 14px; color: #333;'>";
    html += "  Caso a devolução não seja realizada até <b>" + dataLimite + "</b>, seguindo o procedimento correto e com registro no formulário abaixo, o valor será automaticamente descontado do próximo faturamento.<br><br>";
    html += "  Para abatimento de saldo pendente, lembre-se de selecionar a opção \"<b>Mês Anterior</b>\" no campo \"Mês de referência para devolução\".";
    html += "</div>";
  }

  // 🎯 Botão de devolução
  html += "<div style='margin-top: 15px; margin-bottom: 25px;'>";
  html += "  <a href='" + linkForms + "' style='background-color:#00AFFF;border-radius:4px;color:#ffffff;display:inline-block;font-family:Arial,sans-serif;font-size:14px;font-weight:bold;line-height:40px;text-align:center;text-decoration:none;width:250px;-webkit-text-size-adjust:none;'>Formalizar Devolução Aqui</a>";
  html += "</div>";

  html += "📎 Anexamos documentos importantes para apoiar o seu processo:<br>";
  html += "<ul style='list-style-type: none; padding-left: 5px; margin-top: 5px;'>";
  html += "  <li style='margin-bottom: 5px;'>📄 <b>Padrão de envio de insumos</b> — contém as orientações para preparação e expedição dos materiais.</li>";
  html += "  <li>📄 <b>Modelo de identificação</b> — deve ser preenchido e enviado junto à devolução dos insumos.</li>";
  html += "</ul><br>";

  html += "Solicitamos a regularização desta pendência o quanto antes, para evitar descontos. Caso haja divergências nos números, dificuldades no preenchimento ou se a sua base não estiver disponível, entre em contato imediatamente pelo e-mail financeiro@exemplo.com, para que possamos realizar os ajustes antes do desconto.<br><br>";
  html += "Contamos com o apoio de todos para que as devoluções ocorram dentro do prazo e em conformidade com as orientações enviadas nos anexos!";

  return html;
}
