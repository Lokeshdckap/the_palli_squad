import { Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider.jsx";

export default function GuestLayout() {
  const { auth } = useStateContext();

  if (auth) {
    if (auth.token) {
      return <Navigate to={`/`} />;
    }

  }
  return (
    <div>
      <Outlet />
    </div>
  );
}
