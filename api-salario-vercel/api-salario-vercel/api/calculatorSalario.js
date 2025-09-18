const cors = require('cors');

// Inicializa o CORS para permitir acesso de qualquer origem
const corsHandler = cors({
  origin: '*',
  methods: ['GET', 'HEAD'],
});

// Funções de cálculo (as mesmas que já tínhamos)
const calcularINSS = (salarioBruto) => {
  let contribuicao = 0;
  if (salarioBruto > 0) {
    const faixa1 = Math.min(salarioBruto, 1412.00);
    contribuicao += faixa1 * 0.075;
  }
  if (salarioBruto > 1412.00) {
    const faixa2 = Math.min(salarioBruto - 1412.00, 2666.68 - 1412.00);
    contribuicao += faixa2 * 0.09;
  }
  if (salarioBruto > 2666.68) {
    const faixa3 = Math.min(salarioBruto - 2666.68, 4000.03 - 2666.68);
    contribuicao += faixa3 * 0.12;
  }
  if (salarioBruto > 4000.03) {
    const faixa4 = Math.min(salarioBruto - 4000.03, 7786.02 - 4000.03);
    contribuicao += faixa4 * 0.14;
  }
  return Math.min(contribuicao, 908.85);
};

const calcularIRRF = (salarioBruto, inss) => {
  const baseCalculo = salarioBruto - inss;
  let imposto = 0;
  if (baseCalculo <= 2259.20) {
    imposto = 0;
  } else if (baseCalculo <= 2826.65) {
    imposto = (baseCalculo * 0.075) - 169.44;
  } else if (baseCalculo <= 3751.05) {
    imposto = (baseCalculo * 0.15) - 381.44;
  } else if (baseCalculo <= 4664.68) {
    imposto = (baseCalculo * 0.225) - 662.77;
  } else {
    imposto = (baseCalculo * 0.275) - 896.00;
  }
  return imposto > 0 ? imposto : 0;
};


// Handler da função para a Vercel
module.exports = (request, response) => {
  corsHandler(request, response, () => {
    const salarioBruto = parseFloat(request.query.salarioBruto);

    if (isNaN(salarioBruto) || salarioBruto < 0) {
      return response.status(400).json({
        erro: "Parâmetro 'salarioBruto' é inválido. Forneça um número positivo.",
      });
    }

    const inss = calcularINSS(salarioBruto);
    const irrf = calcularIRRF(salarioBruto, inss);
    const salarioLiquido = salarioBruto - inss - irrf;

    const resultado = {
      salarioBruto: parseFloat(salarioBruto.toFixed(2)),
      descontoINSS: parseFloat(inss.toFixed(2)),
      descontoIRRF: parseFloat(irrf.toFixed(2)),
      salarioLiquido: parseFloat(salarioLiquido.toFixed(2)),
    };

    return response.status(200).json(resultado);
  });
};
