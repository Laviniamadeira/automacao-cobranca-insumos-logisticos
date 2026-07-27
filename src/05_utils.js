// 🧰 5. FUNÇÕES AUXILIARES
// ==============================================================================

function formatarMoeda(valor) {
  return "R$ " + parseFloat(valor).toFixed(2).replace(".", ",");
}
