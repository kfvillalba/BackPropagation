import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import TableDrawer from "../components/TableDrawer";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  sum,
  updateDoc,
} from "firebase/firestore";
import { db } from "../components/firebase";
import CalcularSalidas from "../components/CalcularSalidas";
import Error from "../components/Error";
import Pesos from "../components/Pesos";
import Umbral from "../components/Umbral";
import EditIcon from "../assets/EditIcon";
import Swal from "sweetalert2";
import DeleteIcon from "../assets/DeleteIcon";

const PaginaEntrenamiento = () => {
  // firebase
  const [dataForm, setDataform] = useState([]);
  useEffect(() => {
    const q = query(collection(db, "IA-DATABASE"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let docArray = [];
      querySnapshot.forEach((doc) => {
        docArray.push({ ...doc.data(), id: doc.id });
      });
      docArray.map((item) => {
        item.MatrizInicial = JSON.parse(item.MatrizInicial);
        item.Pesos = JSON.parse(item.Pesos);
        item.Umbrales = JSON.parse(item.Umbrales);

        for (let index = 0; index < item.Pesos.length; index++) {
          item.Pesos[index] = convertirMatrizANumeros(item.Pesos[index]);
        }
        for (let index = 0; index < item.Umbrales.length; index++) {
          item.Umbrales[index] = convertirArrayANumeros(item.Umbrales[index]);
        }
      });
      setDataform(docArray);
    });

    return () => unsubscribe();
  }, []);

  const updateRed = (id, data) => {
    let red = doc(db, "IA-DATABASE", id);
    updateDoc(red, data);
  };
  const deleteRed = (id) => {
    let red = doc(db, "IA-DATABASE", id);
    Swal.fire({
      title: "¿Estas Seguro?",
      text: "No podras recuperar esta red!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, borra la Red!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Red Borrada!",
          text: "La red ha sido borrada.",
          icon: "success",
        });
        deleteDoc(red);
      }
    });
  };

  //variables useState

  const [selectedItem, SetSelectecItem] = useState(-1);

  //variables
  const dataItem = dataForm[selectedItem];
  let errorIteracion = 1;
  let count = 1;
  let pause = false;
  let ERS = [];
  let pesos = [];
  let umbrales = [];

  // resultados del entrenamiento

  let salidasObtenidas;
  let erroresLineales;
  let erroresNoLineales = [];
  let erroresPatron = [];
  let erroresIteracion = [];

  //Funciones
  function convertirMatrizANumeros(matriz) {
    return matriz.map((fila) => fila.map((elemento) => Number(elemento)));
  }

  function convertirArrayANumeros(matriz) {
    return matriz.map((elemento) => parseFloat(elemento));
  }

  const getPatrones = (matriz, numEntradas) => {
    let matrizNueva = [];
    matriz.map((item) => {
      matrizNueva.push(item.slice(0, numEntradas));
    });

    return convertirMatrizANumeros(matrizNueva);
  };

  const getFuncAct = () => {
    let FuncAct = [];

    dataItem.FunActivacionCapa1 != 0
      ? FuncAct.push(dataItem.FunActivacionCapa1)
      : 0;
    dataItem.FunActivacionCapa2 != 0
      ? FuncAct.push(dataItem.FunActivacionCapa2)
      : 0;
    dataItem.FunActivacionCapa3 != 0
      ? FuncAct.push(dataItem.FunActivacionCapa3)
      : 0;
    dataItem.FuncionActivacionSalida != 0
      ? FuncAct.push(dataItem.FuncionActivacionSalida)
      : 0;

    return FuncAct;
  };
  const getSalidas = (matriz, numEntradas) => {
    let matrizNueva = [];
    matriz.map((item) => {
      matrizNueva.push(item.slice(numEntradas));
    });
    return convertirMatrizANumeros(matrizNueva);
  };

  function stop() {
    pause = true;
    count = 1;
    //guardarPesosUmbrales();
  }
  function start() {
    pause = false;
    iterarWhile();
  }
  const guardarPesosUmbrales = () => {
    const data = {
      Pesos: [JSON.stringify(pesos)],
      Umbrales: [JSON.stringify(umbrales)],
    };
    updateRed(dataItem.id, data);
  };

  const iterarWhile = () => {
    if (count == 1) {
      pesos = dataItem.Pesos;
      umbrales = dataItem.Umbrales;
    }

    let funcionesActivacion = getFuncAct();
    let inputs = getPatrones(dataItem.MatrizInicial, dataItem.NumEntradas);
    let salidasEsperadas = getSalidas(
      dataItem.MatrizInicial,
      dataItem.NumEntradas
    );
    const iteraciones = dataItem.NumIteraciones;
    const rataApendizaje = dataItem.RataApendizaje;
    const errorMaximo = parseFloat(dataItem.ErrorMaximo);
    if (pause == false) {
      if ((count > iteraciones) | (errorIteracion < errorMaximo)) {
        stop();
      } else {
        console.log("Iteracion: ", count);
        inputs.map((inputs, index) => {
          // Calculamos las salidas

          salidasObtenidas = CalcularSalidas(
            pesos,
            umbrales,
            inputs,
            funcionesActivacion
          );

          // Calculamos los Errores Lineales

          erroresLineales = Error.calcularErrorLineal(
            salidasEsperadas[index],
            salidasObtenidas[salidasObtenidas.length - 1]
          );

          // Calculamos el error del patron

          erroresPatron.push(Error.calcularErrorPatron(erroresLineales));

          // calculamos los errores NO lineales
          erroresNoLineales = Error.calcularErroresNoLineales(
            erroresLineales,
            pesos
          );

          // calculamos los pesos nuevos

          pesos = Pesos.calcularPesosNuevos(
            pesos,
            rataApendizaje,
            erroresNoLineales,
            erroresLineales,
            funcionesActivacion,
            inputs,
            salidasObtenidas
          );
          console.log(umbrales);
          // calculamos los Umbrales nuevos
          umbrales = Umbral.calcularUmbralesNuevos(
            umbrales,
            rataApendizaje,
            erroresNoLineales,
            erroresLineales,
            funcionesActivacion,
            salidasObtenidas
          );
          console.log(umbrales);
          //
        });
        errorIteracion = Error.calcularErrorIteracion(erroresPatron);
        console.log(errorIteracion);
        erroresPatron = [];
        erroresNoLineales = [];
        erroresLineales = [];

        count++;
      }
      setTimeout(iterarWhile, 1);
    }
  };

  // ejecucion de funciones

  return (
    <div>
      <Navbar />
      <div className=" p-3 border-2 border-azul-oscuro lg:w-1/2 sm:w-full m-3 mx-auto rounded-lg">
        {dataForm ? (
          <div>
            <div className="form__section">
              <ul>
                {dataForm.map((item, index) => (
                  <li className="flex gap-1" key={index}>
                    <button
                      value={index}
                      className="btn__list"
                      onClick={(e) => {
                        SetSelectecItem(e.target.value);
                        console.log(dataForm[e.target.value]);
                      }}
                    >
                      {item.Nombre}
                    </button>
                    <button className="btn__list p-0 text-center w-12">
                      <EditIcon clases={"size-5"} />
                    </button>
                    <button
                      onClick={() => {
                        deleteRed(dataForm[index].id);
                      }}
                      className="btn__list p-0 text-center w-12"
                    >
                      <DeleteIcon clases={"size-5"} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="form__section">
              {selectedItem != -1 ? (
                <div>
                  <h1 className="text-center">Dataset</h1>
                  <div className="flex justify-evenly w-full">
                    <p className="message">Entradas: {dataItem.NumEntradas}</p>
                    <p className="message">Salidas: {dataItem.NumSalidas}</p>
                    <p className="message">Patrones: {dataItem.NumPatrones}</p>
                    <p className="message">
                      Capas Ocultas: {dataItem.NumCapasOcultas}
                    </p>
                  </div>

                  <TableDrawer data={dataItem.MatrizInicial} />
                  {/* <div className="gap-4 flex  lg:flex-row form__section">
                    <div className="flex flex-col lg:w-1/2 sm:w-screen">
                      <h1>Pesos Iniciales</h1>
                      <TableDrawer data={dataItem.PesosInicialesCapa0Capa1} />
                    </div>
                    <div className="flex flex-col lg:w-1/2 sm:w-full">
                      <h1>Umbral Inicial</h1>
                      <TableDrawer
                        data={dataItem.UmbralesInicialesCapa0Capa1}
                      />
                    </div>
                  </div>
                  <div className="gap-4 flex  lg:flex-row mt-3 form__section">
                    <div className="flex flex-col lg:w-1/2 sm:w-screen">
                      <h1>Ultimos Pesos</h1>
                      <TableDrawer data={ultimosPesos} />
                    </div>
                    <div className="flex flex-col lg:w-1/2 sm:w-full">
                      <h1>Ultimo Umbral</h1>
                      <TableDrawer data={ultimoUmbral} />
                    </div>
                  </div> */}

                  <div className="flex gap-4">
                    <button
                      onClick={() => {
                        start();
                      }}
                      className="btn__form "
                    >
                      Empezar
                    </button>
                    <button
                      onClick={() => {
                        stop();
                      }}
                      className="hover:bg-red-900 btn__form bg-red-950"
                    >
                      Detener
                    </button>
                  </div>
                </div>
              ) : (
                <p className="message">Seleccione un Entrenamiento</p>
              )}
            </div>
          </div>
        ) : (
          <p className="message">Llene el formuario en "Datos de Entrada"</p>
        )}
      </div>
    </div>
  );
};

export default PaginaEntrenamiento;
