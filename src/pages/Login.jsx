import { useState } from "react";
import { DropdownButton, Dropdown } from "react-bootstrap";
import { userSignin, userSignup } from "../api/auth";
import { useNavigate } from "react-router-dom";
// import TextField from "@mui/material/TextField";

function Signin() {
  const [showSignup, setShowSignup] = useState(false);
  const [name, setName] = useState("");
  const [userType, setUserType] = useState("CUSTOMER");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  function updateSignupData(e) {
    if (e.target.id === "userid") {
      setUserId(e.target.value);
    } else if (e.target.id === "name") {
      setName(e.target.value);
    } else if (e.target.id === "password") {
      setPassword(e.target.value);
    } else if (e.target.id === "email") {
      setEmail(e.target.value);
    } else if (e.target.id === "userType") {
      setUserType(e.target.value);
    }
  }
  const signupFn = (e) => {
    e.preventDefault();
    const data = {
      name: name,
      userId: userId,
      password: password,
      email: email,
      userType: userType,
    };
    userSignup(data)
      .then((response) => {
        console.log("successfully signed up", response);
      })
      .catch((error) => {
        console.log(error);
        setMessage(error.response.data.message);
      });
  };

  const loginFn = (e) => {
    e.preventDefault(); 
    const data = {
      userId: userId,
      password: password,
    };
    userSignin(data)
      .then((response) => {
        localStorage.setItem("name", response.data.name);
        localStorage.setItem("userId", response.data.userId);
        localStorage.setItem("email", response.data.email);
        localStorage.setItem("userTypes", response.data.userTypes);
        localStorage.setItem("userStatus", response.data.userStatus);
        localStorage.setItem("token", response.data.accessToken);
        if (response.data.userTypes === "CUSTOMER") navigate("/customer");
        else if (response.data.userTypes === "ENGINEER") navigate("/engineer");
        else if (response.data.userTypes === "ADMIN") navigate("/admin");
        else navigate("/");
      })
      .catch((error) => {
        console.log(error);
        setMessage(error.message);
      });
  };
  function handleSelect(e) {
    setUserType(e);
  }
  function changeSignup() {
    setShowSignup(!showSignup);
  }
  return (
    <div className="vh-100 d-flex justify-content-center align-items-center login-home bg-opacity-50">
      <div className="card m-4 p-4 rounded-4 shadow-lg bg-transparent">
        <h3 className="text-center text-primary bolder">
          {showSignup ? "Sign up" : "Sign in"}
        </h3>
        <form onSubmit={showSignup ? signupFn : loginFn}>
          <div className="input-group">
            <TextField
              label="User Id"
              variant="outlined"
              type="text"
              className="form-control m-2"
              inputProps={{ style: { height: 15 } }}
              value={userId}
              id="userid"
              onChange={updateSignupData}
              onKeyUp={(e) => e.key === "Enter" && loginFn(e)}
            />
          </div>
          {showSignup ? (
            <>
              <div className="input-group">
                <TextField
                  label="Email"
                  variant="outlined"
                  type="email"
                  id="email"
                  className="form-control m-2"
                  inputProps={{ style: { height: 15 } }}
                  onChange={updateSignupData}
                  onKeyUp={(e) => e.key === "Enter" && loginFn(e)}
                />
              </div>

              <div className="input-group">
                <TextField
                  label="UserName"
                  variant="outlined"
                  type="text"
                  className="form-control m-2"
                  inputProps={{ style: { height: 15 } }}
                  id="name"
                  onChange={updateSignupData}
                  onKeyUp={(e) => e.key === "Enter" && loginFn(e)}
                />
              </div>
            </>
          ) : null}
          <div className="input-group">
            <TextField
              label="Password"
              variant="outlined"
              type="password"
              className="form-control m-2"
              inputProps={{ style: { height: 15 } }}
              value={password}
              id="password"
              onChange={updateSignupData}
              onKeyUp={(e) => e.key === "Enter" && loginFn(e)}
            />
          </div>
          {showSignup ? (
            <>
              <div className="input-group d-flex justify-content-around align-items-center">
                <span>User Type :</span>
                <DropdownButton
                  align="end"
                  title={userType}
                  id="userType"
                  variant="light"
                  onSelect={handleSelect}
                >
                  <Dropdown.Item eventKey="CUSTOMER">CUSTOMER </Dropdown.Item>
                  <Dropdown.Item eventKey="ENGINEER">ENGINEER </Dropdown.Item>
                </DropdownButton>
              </div>
            </>
          ) : null}
          <div className="text-center">
            <button
              type="submit"
              className="justify-center btn btn-primary fw-bolder w-75 text-white m-2"
            >
              {showSignup ? "Sign up" : "Sign in"}
            </button>
          </div>
          <div
            className="mt-3 text-primary text-center"
            onClick={changeSignup}
            style={{ cursor: "pointer" }}
          >
            {showSignup ? "Already registered? Sign in" : "New here? Sign up"}
          </div>
          <div className="text-center text-danger h6">{message}</div>
        </form>
      </div>
    </div>
  );
}

export default Signin;