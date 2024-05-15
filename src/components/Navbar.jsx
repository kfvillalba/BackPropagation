import React from "react";
import { Link, NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="rounded-b-lg shadow-lg flex place-content-center lg:w-1/2 mx-auto py-3 bg-azul-oscuro text-white sm:w-full">
      <NavLink to={"/"}>
        {({ isActive }) => {
          return (
            <button className={isActive ? "btn__nav__active" : "btn__nav"}>
              Formulario
            </button>
          );
        }}
      </NavLink>
      <NavLink to={"/entrenamiento"}>
        {({ isActive }) => {
          return (
            <button className={isActive ? "btn__nav__active" : "btn__nav"}>
              Entrenamiento
            </button>
          );
        }}
      </NavLink>
      <NavLink to={"/simulacion"}>
        {({ isActive }) => {
          return (
            <button className={isActive ? "btn__nav__active" : "btn__nav"}>
              Simulacion
            </button>
          );
        }}
      </NavLink>
    </div>
  );
};

export default Navbar;
