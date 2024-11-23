import { useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate("/");
  };

  return (
    <div className="page404">
      <h1>404</h1>
      <p>Lo sentimos, la página que buscas no existe.</p>
      <button type="button" onClick={handleRedirect}>
        Regresar al inicio
      </button>
    </div>
  );
}

export default NotFound;
