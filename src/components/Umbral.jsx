import FuncAct from "./FuncAct";

const calcularUmbralesNuevos = (
  umbralesParametro,
  rataApendizaje,
  erroresNoLineales,
  erroresLineales,
  funcionesActivacion,
  salidasObtenidas
) => {
  let last = umbralesParametro.length - 1;
  let umbralesNuevos = [];
  for (let numUmbral = 0; numUmbral < umbralesParametro.length; numUmbral++) {
    let umbral = umbralesParametro[numUmbral];
    let umbralTemp = [];
    let salidas = salidasObtenidas[numUmbral];
    let funcAct = funcionesActivacion[numUmbral];
    let errorNolineal = erroresNoLineales[numUmbral];
    for (let index = 0; index < umbral.length; index++) {
      let derivada = 0;

      switch (funcAct) {
        case "Sigmoid":
          derivada = FuncAct.sigmoidDerivada(salidas[index]);
          break;
        case "Tanh":
          derivada = FuncAct.tanhDerivada(salidas[index]);
          break;
        case "ReLU":
          derivada = FuncAct.reluDerivada(salidas[index]);
          break;
        case "Sin":
          derivada = FuncAct.senoDerivada(salidas[index]);
          break;
      }

      if (numUmbral == last) {
        umbralTemp.push(
          umbral[index] +
            2 * rataApendizaje * derivada * erroresLineales[index] * 1
        );
      } else {
        umbralTemp.push(
          umbral[index] +
            2 * rataApendizaje * derivada * errorNolineal[index] * 1
        );
      }
    }
    umbralesNuevos.push(umbralTemp);
  }
  return umbralesNuevos;
};
export default { calcularUmbralesNuevos };
