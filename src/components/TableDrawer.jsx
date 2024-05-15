import React, { useState } from "react";

const TableDrawer = ({ data }) => {
  const headers = data.length > 0 ? Object.keys(data[0]) : [];
  return (
    <>
      {data.length === 0 ? (
        <p>No data available.</p>
      ) : (
        <table className="w-full text-center border border-azul-oscuro mt-3">
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
