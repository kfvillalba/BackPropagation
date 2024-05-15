import { Link } from "react-router-dom";

export const NotFoundPage = () => {
  return (
    <div className="flex flex-col gap-2">
      404 Pagina no encontrada
      <Link to="/">Pagina Principal</Link>;
    </div>
  );
};
