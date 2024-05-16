import React, { useState } from "react";

const TableDrawer = ({ data, entradas, salidas, salidasObtenida }) => {
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
        <table className="w-full text-center border border-azul-oscuro mt-3">
          <thead>
            <tr>
              {entradas.map((entradas, index) => (
                <th key={index}>{`X${index + 1}`}</th>
              ))}
              {salidas.map((salidas, index) => (
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
              <tr key={index}>
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
