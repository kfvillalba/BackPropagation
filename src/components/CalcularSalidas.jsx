import FuncAct from "./FuncAct";

const CalcularSalidas = (
  pesosParametro,
  umbralParametro,
  patronParametro,
  funcionesActivacion
) => {
  let patron = patronParametro;
  let salidas = [];
  for (let numPesos = 0; numPesos < pesosParametro.length; numPesos++) {
    let funcAct = funcionesActivacion[numPesos];
    let pesos = pesosParametro[numPesos];
    let umbral = umbralParametro[numPesos];
    let salidasTemp = [];
    for (let col = 0; col < pesos.length; col++) {
      let suma = 0;
      for (let fila = 0; fila < pesos[0].length; fila++) {
        suma += patron[fila] * pesos[col][fila];
      }
      suma -= umbral[col];
      let salida;
      switch (funcAct) {
        case "Sigmoid":
          salida = FuncAct.Sigmoid(suma);
          break;
        case "Tanh":
          salida = FuncAct.Tanh(suma);
          break;
        case "ReLU":
          salida = FuncAct.ReLu(suma);
          break;
        case "Sin":
          salida = FuncAct.Seno(suma);
          break;
      }

      salidasTemp.push(salida);
    }
    salidas.push(salidasTemp);
    patron = salidasTemp;
  }

  return salidas;
};

export default CalcularSalidas;
