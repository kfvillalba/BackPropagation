import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
const ModalEditEntrenamiento = ({ open, onClose, editar, dataRed }) => {
  const Navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handleNumCapas = (numCapas) => {
    let array = [];
    for (let index = 0; index < numCapas; index++) {
      array.push(index + 1);
    }
    return array;
  };
  let numNueronas = [
    dataRed.NumNeuronasCapa1,
    dataRed.NumNeuronasCapa2,
    dataRed.NumNeuronasCapa3,
  ];
  let FuncionesActivacionCapasOcultas = [
    dataRed.FunActivacionCapa1,
    dataRed.FunActivacionCapa2,
    dataRed.FunActivacionCapa3,
  ];

  const [numCapas, setNumCapas] = useState(
    handleNumCapas(dataRed.NumCapasOcultas)
  );

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

  const handleCapas = (event) => {
    let array = [];
    for (let index = 0; index < event.target.value; index++) {
      array.push(index + 1);
    }
    setNumCapas(array);
  };

  const onSubmit = (data) => {
    data.FunActivacionCapa2 ? 0 : (data.FunActivacionCapa2 = 0);
    data.FunActivacionCapa3 ? 0 : (data.FunActivacionCapa3 = 0);
    data.NumNeuronasCapa2 ? 0 : (data.NumNeuronasCapa2 = 0);
    data.NumNeuronasCapa3 ? 0 : (data.NumNeuronasCapa3 = 0);

    let pesos = [];
    let umbrales = [];
    pesos.push(
      generarEstructura(data.NumNeuronasCapa1, data.NumEntradas, -1, 1)
    );
    pesos.push(
      generarEstructura(
        data.NumNeuronasCapa2 == 0 ? data.NumSalidas : data.NumNeuronasCapa2,
        data.NumNeuronasCapa1,
        -1,
        1
      )
    );
    pesos.push(
      generarEstructura(
        data.NumNeuronasCapa3 == 0 ? data.NumSalidas : data.NumNeuronasCapa3,
        data.NumNeuronasCapa2,
        -1,
        1
      )
    );
    pesos.push(
      generarEstructura(data.NumSalidas, data.NumNeuronasCapa3, -1, 1)
    );

    umbrales.push(generarEstructura(data.NumNeuronasCapa1, 1, -1, 1));
    umbrales.push(
      generarEstructura(
        data.NumNeuronasCapa2 == 0 ? data.NumSalidas : data.NumNeuronasCapa2,
        data.NumNeuronasCapa1 != 0 ? 1 : 0,
        -1,
        1
      )
    );
    umbrales.push(
      generarEstructura(
        data.NumNeuronasCapa3 == 0 ? data.NumSalidas : data.NumNeuronasCapa3,
        data.NumNeuronasCapa2 != 0 ? 1 : 0,
        -1,
        1
      )
    );
    umbrales.push(
      generarEstructura(
        data.NumSalidas,
        data.NumNeuronasCapa3 != 0 ? 1 : 0,
        -1,
        1
      )
    );
    let cantidad = data.NumCapasOcultas + 1;
    pesos = pesos.splice(0, cantidad);
    umbrales = umbrales.splice(0, cantidad);

    data.Pesos = JSON.stringify(pesos);
    data.Umbrales = JSON.stringify(umbrales);

    onClose();
    editar(data);

    Navigate("/entrenamiento");
    reset();
  };

  if (!open) return null;
  return (
    <div className="fixed w-screen top-0 left-0 h-screen z-10 flex items-center justify-center bg-black/50">
      <form
        className="py-5 px-2 lg:w-1/2 w-full h-full overflow-y-auto mx-auto border-2 bg-slate-100 border-azul-oscuro rounded-lg"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1 className="text-center mb-3">Editar la red "{dataRed.Nombre}"</h1>
        <div className="form__section">
          <h1 className="text-center mb-3">Parametros de inicalizacion</h1>
          <div className="Nombre">
            <label htmlFor="Nombre" className="label__form ">
              Nombre del entrenamiento.
            </label>
            <input
              defaultValue={dataRed.Nombre}
              onWheel={(e) => e.target.blur()}
              id="Nombre"
              className="input__form"
              type="text"
              {...register("Nombre", {
                required: "Campo Obligatorio",
              })}
            />
            <b className="spam_form_error">{errors?.Nombre?.message}</b>
          </div>
          <div className="NumEntradas">
            <label htmlFor="NumEntradas" className="label__form ">
              Entradas.
            </label>
            <input
              defaultValue={dataRed.NumEntradas}
              onWheel={(e) => e.target.blur()}
              id="NumEntradas"
              className="input__form"
              type="number"
              {...register("NumEntradas", {
                valueAsNumber: true,
                required: "Campo Obligatorio",
                min: { value: 0, message: "Minimo 1 Entrada" },
              })}
            />
            <b className="spam_form_error">{errors?.NumEntradas?.message}</b>
          </div>

          <div className="NumSalidas">
            <label htmlFor="NumSalidas" className="label__form ">
              Salidas.
            </label>
            <input
              defaultValue={dataRed.NumSalidas}
              onWheel={(e) => e.target.blur()}
              id="NumSalidas"
              className="input__form"
              type="number"
              {...register("NumSalidas", {
                valueAsNumber: true,
                required: "Campo Obligatorio",
                min: { value: 0, message: "Minimo 1 salida" },
              })}
            />
            <b className="spam_form_error">{errors?.NumSalidas?.message}</b>
          </div>
          <div className="FuncionActivacionSalida">
            <label className="label__form" htmlFor="FuncionActivacionSalida">
              Funcion de Activacion de la Capa de Salida
            </label>
            <select
              defaultValue={dataRed.FuncionActivacionSalida}
              {...register("FuncionActivacionSalida", {
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
              <option value="ReLu">Lineal</option>
            </select>
          </div>
          <div className="NumPatrones">
            <label htmlFor="NumPatrones" className="label__form ">
              Patrones.
            </label>
            <input
              defaultValue={dataRed.NumPatrones}
              onWheel={(e) => e.target.blur()}
              id="NumPatrones"
              className="input__form"
              type="number"
              {...register("NumPatrones", {
                valueAsNumber: true,
                required: "Campo Obligatorio",
                min: { value: 0.00001, message: "Minimo 1 patron" },
              })}
            />
            <b className="spam_form_error">{errors?.NumPatrones?.message}</b>
          </div>
          <div className="RataApendizaje">
            <label htmlFor="RataApendizaje" className="label__form ">
              Rata de Apendizaje.
            </label>
            <input
              defaultValue={dataRed.RataApendizaje}
              onWheel={(e) => e.target.blur()}
              step={0.1}
              id="RataApendizaje"
              className="input__form"
              type="number"
              {...register("RataApendizaje", {
                valueAsNumber: true,
                required: "Campo Obligatorio",
                min: {
                  value: 0.0000001,
                  message: "Tiene que ser mayor que 0",
                },
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
          <div className="NumCapasOcultas">
            <label className="label__form" htmlFor="NumCapasOcultas">
              Seleccione el Numero de Capas Ocultas
            </label>
            <select
              defaultValue={dataRed.NumCapasOcultas}
              {...register("NumCapasOcultas", {
                required: "Campo Obligatorio",
                valueAsNumber: true,
              })}
              onChange={handleCapas}
              className="input__form"
              id="NumCapasOcultas"
            >
              <option value={1}>1 Capa</option>
              <option value={2}>2 Capas</option>
              <option value={3}>3 Capas</option>
            </select>
            <b className="spam_form_error">
              {errors?.NumCapasOcultas?.message}
            </b>
            {numCapas.map((e, i) => (
              <div key={e} className="form__section">
                <h2 className="text-center font-semibold">
                  {`Configuracion Capa Oculta ${e}`}
                </h2>
                <div className={`NumNeuronasCapa${e}`}>
                  <label
                    htmlFor={`NumNeuronasCapa${e}`}
                    className="label__form "
                  >
                    {`Numero de Neuronas`}
                  </label>
                  <input
                    defaultValue={numNueronas[i]}
                    onWheel={(e) => e.target.blur()}
                    id={`NumNeuronasCapa${e}`}
                    className="input__form"
                    type="number"
                    {...register(`NumNeuronasCapa${e}`, {
                      valueAsNumber: true,
                      required: "Campo Obligatorio",
                      min: { value: 0, message: "Minimo 1 iteracion" },
                    })}
                  />
                </div>
                <div className={`FunActivacionCapa${e}`}>
                  <label
                    className="label__form"
                    htmlFor={`FunActivacionCapa${e}`}
                  >
                    {`Funcion de Activacion`}
                  </label>
                  <select
                    defaultValue={FuncionesActivacionCapasOcultas[i]}
                    {...register(`FunActivacionCapa${e}`, {
                      required: "Campo Obligatorio",
                      min: {
                        value: 1,
                        message: "Seleccione una Funcion de Activacion",
                      },
                    })}
                    className="input__form"
                    id={`FunActivacionCapa${e}`}
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
          <div className="NumIteraciones">
            <label htmlFor="NumIteraciones" className="label__form ">
              Iteraciones.
            </label>
            <input
              defaultValue={dataRed.NumIteraciones}
              onWheel={(e) => e.target.blur()}
              id="NumIteraciones"
              className="input__form"
              type="number"
              {...register("NumIteraciones", {
                valueAsNumber: true,
                required: "Campo Obligatorio",
                min: { value: 0, message: "Minimo 1 iteracion" },
              })}
            />
            <b className="spam_form_error">{errors?.NumIteraciones?.message}</b>
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
              defaultValue={dataRed.ErrorMaximo}
              step={0.0000000001}
              {...register("ErrorMaximo", {
                required: "Campo Obligatorio",
                valueAsNumber: true,
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

        <div className="flex gap-3">
          <button type="submit" className="btn__form">
            Enviar
          </button>
          <button
            onClick={() => {
              onClose();
              reset();
            }}
            className="btn__form"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default ModalEditEntrenamiento;
