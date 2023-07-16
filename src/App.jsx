import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signin from "./pages/Login";
import Customer from "./pages/Customer";
import Engineer from "./pages/Engineer";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import RequireAuth from "./components/RequireAuth";
import Unauth from "./pages/Unauthorized";
import '@coreui/coreui/dist/css/coreui.min.css';
import '@coreui/coreui/dist/js/coreui.min.js';
import 'react-circular-progressbar/dist/styles.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Suspense } from "react";

const ROLES = {
  "CUSTOMER": "CUSTOMER",
  "ADMIN": "ADMIN",
  "ENGINEER": "ENGINEER",
};

function App() {
  return (
    <Router>
      <Suspense fallback={<div>loading...</div>}>
      <Routes>
        <Route path="/" element={<Signin />}></Route>
            <Route element={<RequireAuth allowedRoles={[ROLES.ADMIN]} />}>
            <Route path="/admin" element={<Admin />} />
          </Route>
        <Route element={<RequireAuth allowedRoles={[ROLES.ENGINEER]} />}>
          <Route path="/engineer" element={<Engineer />} />
        </Route>
        <Route element={<RequireAuth allowedRoles={[ROLES.CUSTOMER]} />}>
          <Route path="/customer" element={<Customer />} />
        </Route>
        <Route path="/*" element={<Unauth />} />
        <Route path="/unauthorised" element={<Unauth />} />
      </Routes>
        </Suspense>
    </Router>
  );
}
export default App;
