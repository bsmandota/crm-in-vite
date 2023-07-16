import { useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();
  function NavigateBack() {
    navigate(-1);
  }
  return (
    <div>
      <button className="btn btn-primary" onClick={NavigateBack}>
        Go Back
      </button>
    </div>
  );
}

export default NotFound;
