const calcularErrorIteracion = (erroresPatron) => {
  return Math.abs(
    erroresPatron.reduce((a, b) => a + b, 0) / erroresPatron.length
  );
};
const calcularErrorLineal = (salidasEsperadas, salidasObtenidas) => {
  let erroresLineales = [];
  for (let index = 0; index < salidasObtenidas.length; index++) {
    erroresLineales.push(salidasEsperadas[index] - salidasObtenidas[index]);
  }
  return erroresLineales;
};
const calcularErrorPatron = (erroresLineales) => {
  erroresLineales = erroresLineales.map((error) => Math.abs(error));
  return Math.abs(
    erroresLineales.reduce((a, b) => a + b, 0) / erroresLineales.length
  );
};
const calcularErroresNoLineales = (erroresLineales, pesosParametro) => {
  let errores = erroresLineales;
  let ErroresNoLineales = [];
  for (let numPesos = pesosParametro.length - 1; numPesos > 0; numPesos--) {
    let pesos = pesosParametro[numPesos];
    let erroresTemp = [];
    for (let col = 0; col < pesos[0].length; col++) {
      let suma = 0;
      for (let fila = 0; fila < pesos.length; fila++) {
        suma += pesos[fila][col] * errores[fila];
      }
      erroresTemp.push(suma);
    }

    errores = erroresTemp;
    ErroresNoLineales.unshift(erroresTemp);
  }
  return ErroresNoLineales;
};
export default {
  calcularErrorIteracion,
  calcularErrorLineal,
  calcularErrorPatron,
  calcularErroresNoLineales,
};
