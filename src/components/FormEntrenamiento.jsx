import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, collectionGroup } from "firebase/firestore";
import { db } from "./firebase";

const FormEntrenamiento = () => {
  const Navigate = useNavigate();
  const collectionForm = collection(db, "dataForm");

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();
  const [numCapas, setNumCapas] = useState([1]);
  const [csvData, setCsvData] = useState([]);
  const [pesosIniciales, setpesosIniciales] = useState([]);
  const [umbralInicial, setumbralInicial] = useState([]);
  function getRandomArbitrary(min, max) {
    return parseFloat(Math.random() * (max - min) + min).toFixed(1);
  }

  function generarEstructura(filas, columnas, min, max) {
    const estructura = [];
    for (let i = 0; i < filas; i++) {
      const fila = [];
      for (let j = 0; j < columnas; j++) {
        fila.push(getRandomArbitrary(min, max));
      }
      estructura.push(fila);
    }
    return estructura;
  }

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

  const handleCapas = (event) => {
    let array = [];
    for (let index = 0; index < event.target.value; index++) {
      array.push(index + 1);
    }
    setNumCapas(array);
  };
  const onSubmit = async (data) => {
    data.funcionActivacionCapa2 ? 0 : (data.funcionActivacionCapa2 = 0);
    data.funcionActivacionCapa3 ? 0 : (data.funcionActivacionCapa3 = 0);
    data.numNeuronasCapa2 ? 0 : (data.numNeuronasCapa2 = 0);
    data.numNeuronasCapa3 ? 0 : (data.numNeuronasCapa3 = 0);
    const pesosInicialesCapa0Capa1 = generarEstructura(
      data.numNeuronasCapa1,
      data.Entradas,
      -1,
      1
    );
    const umbralesInicialesCapa0Capa1 = generarEstructura(
      data.numNeuronasCapa1,
      1,
      -1,
      1
    );
    const pesosInicialesCapa1Capa2 = generarEstructura(
      data.numNeuronasCapa2 == 0 ? data.Salidas : data.numNeuronasCapa2,
      data.numNeuronasCapa1,
      -1,
      1
    );
    const umbralesInicialesCapa1Capa2 = generarEstructura(
      data.numNeuronasCapa2 == 0 ? data.Salidas : data.numNeuronasCapa2,
      data.numNeuronasCapa1 != 0 ? 1 : 0,
      -1,
      1
    );
    const pesosInicialesCapa2Capa3 = generarEstructura(
      data.numNeuronasCapa3 == 0 ? data.Salidas : data.numNeuronasCapa3,
      data.numNeuronasCapa2,
      -1,
      1
    );
    const umbralesInicialesCapa2Capa3 = generarEstructura(
      data.numNeuronasCapa3 == 0 ? data.Salidas : data.numNeuronasCapa3,
      data.numNeuronasCapa2 != 0 ? 1 : 0,
      -1,
      1
    );
    const pesosInicialesCapa3Capa4 = generarEstructura(
      data.Salidas,
      data.numNeuronasCapa3,
      -1,
      1
    );
    const umbralesInicialesCapa3Capa4 = generarEstructura(
      data.Salidas,
      data.numNeuronasCapa3 != 0 ? 1 : 0,
      -1,
      1
    );

    /*   setpesosIniciales(pesosInicialesData);
    setumbralInicial(umbralInicialData); */

    await addDoc(collection(db, "IA-DATABASE"), {
      Nombre: data.Nombre,
      NumEntradas: data.Entradas,
      // FuncionActivacionEntrada: data.funcionActivacionEntrada,
      NumSalidas: data.Salidas,
      FuncionActivacionSalida: data.funcionActivacionSalida,
      NumPatrones: data.Patrones,
      RataApendizaje: data.RataApendizaje,
      NumCapasOcultas: data.NumCapas,
      NumNeuronasCapa1: data.numNeuronasCapa1,
      FunActivacionCapa1: data.funcionActivacionCapa1,
      NumNeuronasCapa2: data.numNeuronasCapa2,
      FunActivacionCapa2: data.funcionActivacionCapa2,
      NumNeuronasCapa3: data.numNeuronasCapa3,
      FunActivacionCapa3: data.funcionActivacionCapa3,
      NumIteraciones: data.Iteraciones,
      ErrorMaximo: data.ErrorMaximo,
      MatrizInicial: JSON.stringify(csvData),
      PesosInicialesCapa0Capa1: JSON.stringify(pesosInicialesCapa0Capa1),
      UmbralesInicialesCapa0Capa1: JSON.stringify(umbralesInicialesCapa0Capa1),
      PesosInicialesCapa1Capa2: JSON.stringify(pesosInicialesCapa1Capa2),
      UmbralesInicialesCapa1Capa2: JSON.stringify(umbralesInicialesCapa1Capa2),
      PesosInicialesCapa2Capa3: JSON.stringify(pesosInicialesCapa2Capa3),
      UmbralesInicialesCapa2Capa3: JSON.stringify(umbralesInicialesCapa2Capa3),
      PesosInicialesCapa3Capa4: JSON.stringify(pesosInicialesCapa3Capa4),
      UmbralesInicialesCapa3Capa4: JSON.stringify(umbralesInicialesCapa3Capa4),
      Entrenada: false,
    });
    console.log(data);

    Navigate("/entrenamiento");
    reset();
  };

  return (
    <div>
      <form
        className="p-1 mt-5 lg:w-1/2 md:w-full mx-auto border-2 border-azul-oscuro rounded-lg"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="form__section">
          <h1 className="text-center mb-3">Cargar o Generar Datos</h1>
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
        </div>
        <div className="form__section">
          <h1 className="text-center mb-3">Parametros de inicalizacion</h1>
          <div className="Nombre">
            <label htmlFor="Nombre" className="label__form ">
              Nombre del entrenamiento.
            </label>
            <input
              onWheel={(e) => e.target.blur()}
              id="Nombre"
              className="input__form"
              type="text"
              {...register("Nombre", {
                required: "Campo Obligatorio",
              })}
            />
            <b className="spam_form_error">{errors?.Entradas?.message}</b>
          </div>
          <div className="Entradas">
            <label htmlFor="Entradas" className="label__form ">
              Entradas.
            </label>
            <input
              onWheel={(e) => e.target.blur()}
              id="Entradas"
              className="input__form"
              type="number"
              {...register("Entradas", {
                valueAsNumber: true,
                required: "Campo Obligatorio",
                min: { value: 0, message: "Minimo 1 Entrada" },
              })}
            />
            <b className="spam_form_error">{errors?.Entradas?.message}</b>
          </div>
          {/*           <div className="funcionActivacionEntrada">
            <label className="label__form" htmlFor="funcionActivacionEntrada">
              Funcion de Activacion de la Capa de Entrada
            </label>
            <select
              {...register("funcionActivacionEntrada", {
                required: "Campo Obligatorio",
                min: {
                  value: 1,
                  message: "Seleccione una Funcion de Activacion",
                },
              })}
              className="input__form"
              id="funcionActivacionEntrada"
            >
              <option value="0">Seleccione una Funcion de Activacion</option>
              <option value="Sigmoid">Sigmoide</option>
              <option value="Tanh">Tangente hiperbólica o Gaussiana</option>
              <option value="ReLU">Lineal</option>
            </select>
          </div> */}
          <div className="Salidas">
            <label htmlFor="Salidas" className="label__form ">
              Salidas.
            </label>
            <input
              onWheel={(e) => e.target.blur()}
              id="Salidas"
              className="input__form"
              type="number"
              {...register("Salidas", {
                valueAsNumber: true,
                required: "Campo Obligatorio",
                min: { value: 0, message: "Minimo 1 salida" },
              })}
            />
            <b className="spam_form_error">{errors?.Salidas?.message}</b>
          </div>
          <div className="funcionActivacionSalida">
            <label className="label__form" htmlFor="funcionActivacionSalida">
              Funcion de Activacion de la Capa de Salida
            </label>
            <select
              {...register("funcionActivacionSalida", {
                required: "Campo Obligatorio",
                min: {
                  value: 1,
                  message: "Seleccione una Funcion de Activacion",
                },
              })}
              className="input__form"
              id="funcionActivacionSalida"
            >
              <option value="0">Seleccione una Funcion de Activacion</option>
              <option value="Sigmoid">Sigmoide</option>
              <option value="Tanh">Tangente hiperbólica o Gaussiana</option>
              <option value="Sin">Seno</option>
              <option value="ReLU">Lineal</option>
            </select>
          </div>
          <div className="Patrones">
            <label htmlFor="Patrones" className="label__form ">
              Patrones.
            </label>
            <input
              onWheel={(e) => e.target.blur()}
              id="Patrones"
              className="input__form"
              type="number"
              {...register("Patrones", {
                valueAsNumber: true,
                required: "Campo Obligatorio",
                min: { value: 0.00001, message: "Minimo 1 patron" },
              })}
            />
            <b className="spam_form_error">{errors?.Patrones?.message}</b>
          </div>
          <div className="RataApendizaje">
            <label htmlFor="RataApendizaje" className="label__form ">
              Rata de Apendizaje.
            </label>
            <input
              onWheel={(e) => e.target.blur()}
              step={0.1}
              id="RataApendizaje"
              className="input__form"
              type="number"
              {...register("RataApendizaje", {
                valueAsNumber: true,
                required: "Campo Obligatorio",
                min: { value: 0.0000001, message: "Tiene que ser mayor que 0" },
                max: {
                  value: 0.9999999,
                  message: "Tiene que ser menor que 1 ",
                },
              })}
            />
            <b className="spam_form_error">{errors?.RataApendizaje?.message}</b>
          </div>
        </div>
        <div className="form__section">
          <h1 className="text-center mb-3">Configuracion de la Red</h1>
          <div className="#deCapasOcultas">
            <label className="label__form" htmlFor="NumCapas">
              Seleccione el Numero de Capas Ocultas
            </label>
            <select
              {...register("NumCapas", {
                required: "Campo Obligatorio",
              })}
              onChange={handleCapas}
              className="input__form"
              id="NumCapas"
              defaultValue={1}
            >
              <option value={1}>1 Capa</option>
              <option value={2}>2 Capas</option>
              <option value={3}>3 Capas</option>
            </select>
            <b className="spam_form_error">{errors?.NumCapas?.message}</b>
            {numCapas.map((e, i) => (
              <div key={e} className="form__section">
                <h2 className="text-center font-semibold">
                  {`Configuracion Capa Oculta ${e}`}
                </h2>
                <div className={`numNeuronasCapa${e}`}>
                  <label
                    htmlFor={`numNeuronasCapa${e}`}
                    className="label__form "
                  >
                    {`Numero de Neuronas`}
                  </label>
                  <input
                    onWheel={(e) => e.target.blur()}
                    id={`numNeuronasCapa${e}`}
                    className="input__form"
                    type="number"
                    {...register(`numNeuronasCapa${e}`, {
                      valueAsNumber: true,
                      required: "Campo Obligatorio",
                      min: { value: 0, message: "Minimo 1 iteracion" },
                    })}
                  />
                </div>
                <div className={`funcionActivacionCapa${e}`}>
                  <label
                    className="label__form"
                    htmlFor={`funcionActivacionCapa${e}`}
                  >
                    {`Funcion de Activacion`}
                  </label>
                  <select
                    {...register(`funcionActivacionCapa${e}`, {
                      required: "Campo Obligatorio",
                      min: {
                        value: 1,
                        message: "Seleccione una Funcion de Activacion",
                      },
                    })}
                    className="input__form"
                    id={`funcionActivacionCapa${e}`}
                  >
                    <option value="0">
                      Seleccione una Funcion de Activacion
                    </option>
                    <option value="Sigmoid">Sigmoide</option>
                    <option value="Sin">Seno</option>
                    <option value="Tanh">
                      Tangente hiperbólica o Gaussiana
                    </option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="form__section">
          <h1 className="text-center mb-3">Parametros de Finalizacion</h1>
          <div className="Iteraciones">
            <label htmlFor="Iteraciones" className="label__form ">
              Iteraciones.
            </label>
            <input
              onWheel={(e) => e.target.blur()}
              id="Iteraciones"
              className="input__form"
              type="number"
              {...register("Iteraciones", {
                valueAsNumber: true,
                required: "Campo Obligatorio",
                min: { value: 0, message: "Minimo 1 iteracion" },
              })}
            />
            <b className="spam_form_error">{errors?.Iteraciones?.message}</b>
          </div>
          <div className="ErrorMaximo">
            <label htmlFor="ErrorMaximo" className="label__form ">
              Error Maximo.
            </label>
            <input
              onWheel={(e) => e.target.blur()}
              id="ErrorMaximo"
              className="input__form"
              type="number"
              step={0.01}
              {...register("ErrorMaximo", {
                required: "Campo Obligatorio",
                min: { value: 0, message: "El error minimo permitido es 0" },
                max: {
                  value: 0.1,
                  message: "El error maximo permitido es 0.1",
                },
              })}
            />
            <b className="spam_form_error">{errors?.ErrorMaximo?.message}</b>
          </div>
        </div>

        <button type="submit" className="btn__form">
          Enviar
        </button>
      </form>
    </div>
  );
};

export default FormEntrenamiento;
