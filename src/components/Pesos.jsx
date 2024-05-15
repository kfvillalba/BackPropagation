import FuncAct from "./FuncAct";

const calcularPesosNuevos = (
  pesosParametro,
  rataApendizaje,
  erroresNoLineales,
  erroresLineales,
  funcionesActivacion,
  entradasCapa,
  salidasObtenidas
) => {
  let pesosNuevos = [];
  let entradas = entradasCapa;
  let last = pesosParametro.length - 1;
  for (let numPesos = 0; numPesos < pesosParametro.length; numPesos++) {
    let pesosTemp = [];
    let salidas = salidasObtenidas[numPesos];
    let pesos = pesosParametro[numPesos];
    let funcAct = funcionesActivacion[numPesos];
    let errorNolineal = erroresNoLineales[numPesos];
    for (let col = 0; col < pesos.length; col++) {
      let row = [];
      for (let fila = 0; fila < pesos[0].length; fila++) {
        let derivada = 0;

        switch (funcAct) {
          case "Sigmoid":
            derivada = FuncAct.sigmoidDerivada(salidas[col]);
            break;
          case "Tanh":
            derivada = FuncAct.tanhDerivada(salidas[col]);
            break;
          case "ReLU":
            derivada = FuncAct.reluDerivada(salidas[col]);
            break;
          case "Sin":
            derivada = FuncAct.senoDerivada(salidas[col]);
            break;
        }

        if (numPesos == last) {
          row.push(
            pesos[col][fila] +
              2 *
                rataApendizaje *
                derivada *
                erroresLineales[col] *
                entradas[fila]
          );
        } else {
          row.push(
            pesos[col][fila] +
              2 *
                rataApendizaje *
                derivada *
                errorNolineal[col] *
                entradas[fila]
          );
          /* console.log(
            pesos[col][fila],
            "+",
            2 * rataApendizaje,
            "*",
            derivada,
            "*",
            errorNolineal[col],
            "*",
            entradas[fila]
          ); */
        }
      }
      pesosTemp.push(row);
    }
    pesosNuevos.push(pesosTemp);
    entradas = salidas;
  }
  return pesosNuevos;
};
export default { calcularPesosNuevos };
