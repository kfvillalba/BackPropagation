const Sigmoid = (x) => {
  return 1 / (1 + Math.exp(-x));
};
const sigmoidDerivada = (x) => {
  return x * (1 - x);
};
const Tanh = (x) => {
  return Math.tanh(x);
};
function tanhDerivada(x) {
  return 1 - x * x;
}
const ReLu = (x) => {
  return Math.max(0, x);
};
function reluDerivada(x) {
  return x < 0 ? 0 : 1;
}
function Seno(x) {
  return Math.sin(x);
}
function senoDerivada(x) {
  return Math.cos(x);
}

export default {
  Sigmoid,
  sigmoidDerivada,
  Tanh,
  tanhDerivada,
  ReLu,
  reluDerivada,
  Seno,
  senoDerivada,
};
