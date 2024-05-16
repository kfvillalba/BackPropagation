import React, { useState } from "react";

const TableDrawer = ({ data, entradas, salidas, salidasObtenida }) => {
  console.log(salidasObtenida);
  const headers = data.length > 0 ? Object.keys(data[0]) : [];
  const hacerArray = (num) => {
    let array = [];
    for (let index = 0; index < num; index++) {
      array.push(index);
    }
    return array;
  };
  entradas = hacerArray(entradas);
  salidas = hacerArray(salidas);
  salidasObtenida = hacerArray(salidasObtenida);
  return (
    <>
      {data.length === 0 ? (
        <p>No data available.</p>
      ) : (
        <table className="w-full table-fixed text-center border rounded-lg border-azul-oscuro mt-3">
          <thead>
            <tr className="bg-azul-oscuro text-white">
              {entradas &&
                entradas.map((entradas, index) => (
                  <th key={index}>{`X${index + 1}`}</th>
                ))}
              {salidas &&
                salidas.map((salidas, index) => (
                  <th key={index}>{`Y${index + 1}`}</th>
                ))}
              {salidasObtenida &&
                salidasObtenida.map((salidasObtenida, index) => (
                  <th key={index}>{`YR${index + 1}`}</th>
                ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr className="even:bg-slate-50 bg-slate-200" key={index}>
                {headers.map((header, columnIndex) => (
                  <td key={columnIndex}>{row[header]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
};

export default TableDrawer;
