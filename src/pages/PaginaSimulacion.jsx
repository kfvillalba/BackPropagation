import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import TableDrawer from "../components/TableDrawer";
import { collection, onSnapshot, query, sum } from "firebase/firestore";
import { db } from "../components/firebase";
import { useForm } from "react-hook-form";
import Umbral from "../components/Umbral";
import Pesos from "../components/Pesos";
import Error from "../components/Error";
import CalcularSalidas from "../components/CalcularSalidas";

const PaginaSimulacion = () => {
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

  //variables useState

  const [selectedItem, SetSelectecItem] = useState(-1);
  const [csvData, setCsvData] = useState([]);

  //variables
  const dataItem = dataForm[selectedItem];

  let count = 1;
  let pause = false;
  let pesos = [];
  let umbrales = [];
  // resultados del entrenamiento

  let salidasObtenidas;

  //Funciones
  function convertirMatrizANumeros(matriz) {
    return matriz.map((fila) => fila.map((elemento) => parseFloat(elemento)));
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

  const iterarWhile = () => {
    pesos = dataItem.Pesos;
    umbrales = dataItem.Umbrales;

    let funcionesActivacion = getFuncAct();
    let inputs = getPatrones(dataItem.MatrizInicial, dataItem.NumEntradas);
    let salidasEsperadas = getSalidas(
      dataItem.MatrizInicial,
      dataItem.NumEntradas
    );

    inputs.map((inputs, index) => {
      // Calculamos las salidas
      salidasObtenidas = CalcularSalidas(
        pesos,
        umbrales,
        inputs,
        funcionesActivacion
      );
      console.log("Obtenido:", salidasObtenidas[salidasObtenidas.length - 1]);
      console.log("Esperado:", salidasEsperadas[index]);
    });
  };

  // ejecucion de funciones

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();
  const onSubmit = async (data) => {
    console.log(data);
  };
  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const csvText = e.target.result;
        parseCSV(csvText);
      };

      reader.readAsText(file);
    }
  };

  const parseCSV = (csvText) => {
    const lines = csvText.trim().split("\n");

    const parsedData = [];

    for (let j = 0; j < lines.length; j++) {
      const valores = lines[j].trim().split(",");
      const row = valores.map((valor) => Number(valor));
      parsedData.push(row);
    }

    setCsvData(parsedData);
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
                  <li key={index}>
                    <button
                      value={index}
                      className="btn__list"
                      onClick={(e) => {
                        console.log(dataForm);
                        SetSelectecItem(e.target.value);
                        setCsvData(
                          getPatrones(
                            dataForm[e.target.value].MatrizInicial,
                            dataForm[e.target.value].NumEntradas
                          )
                        );
                      }}
                    >
                      {item.Nombre}
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

                  <div className="form__section mt-3">
                    <h1 className="text-center mb-3">
                      Cargar Datos de Entrada
                    </h1>
                    <div className="Subir_Datos">
                      <label className="label__form" htmlFor="user_avatar">
                        Subir datos
                      </label>
                      <input
                        onChange={handleFileChange}
                        accept=".csv"
                        className="block w-full py-1 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                        aria-describedby="user_avatar_help"
                        id="user_avatar"
                        type="file"
                      />
                    </div>
                    <h1 className="text-center">Patrones a Simular</h1>
                    <TableDrawer data={csvData} />
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => {
                        iterarWhile();
                      }}
                      className="btn__form "
                    >
                      Simular
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

export default PaginaSimulacion;
