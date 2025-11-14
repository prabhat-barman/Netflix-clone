import React, { useState, } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";
import logo from "../../assets/nlogo.png";
import banner from "../../assets/bann.jpg";
import { login, signup } from "../../Firebase";

const Login = () => {
  const [signState, setSignState] = useState("Sign In");
  console.log(signState);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const user_auth = async (event) => {
    event.preventDefault();
    if (signState === "Sign In") {
      await login(email, password);
    } else {
      await signup(name, email, password);
    }
  };

  // useEffect(() => {
  //   const loggedInUser = localStorage.getItem("user");
  //   if (loggedInUser) {
  //     navigate("/home");
  //   }
  // }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (signState === "Sign Up") {
      try {
        console.log("1 running");

        await signup(name, email, password);
        alert("Account created successfully! You can now sign in.");
        setSignState("Sign In");
        setName("");
        setEmail("");
        setPassword("");
      } catch (error) {
        console.log("1 running");
        console.error("Signup Error:", error);
        alert(error.message);
      }
    } else {
      try {
        console.log("2 running");
        await login(email, password);
        sessionStorage.setItem("user", JSON.stringify({ email }));
        navigate("/home");
      } catch (error) {
        console.log("21 running");
        console.error("Login Error:", error);
        alert(error.message);
      }
    }
  };

  return (
    <div className="login">
      <img src={banner} alt="Banner" className="banner" />
      <img src={logo} alt="Netflix Logo" className="logo" />

      <div className="login-form">
        <h1>{signState}</h1>

        <form onSubmit={handleSubmit}>
          {signState === "Sign Up" && (
            <input
              value={name}
              onChangeCapture={(e) => {
                setName(e.target.value);
              }}
              type="text"
              placeholder="Your Name"
              // value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}

          <input
            value={email}
            onChangeCapture={(e) => {
              setEmail(e.target.value);
            }}
            type="email"
            placeholder="Email or phone number"
            // value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            value={password}
            onChangeCapture={(e) => {
              setPassword(e.target.value);
            }}
            type="password"
            placeholder="Password"
            // value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="form-help">
            <div className="remember">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Remember Me</label>
            </div>
            <p>Need help?</p>
          </div>

          <div className="button-row">
            <button onClick={user_auth} type="submit">
              {signState}
            </button>
          </div>
        </form>

        <div className="form-switch">
          {signState === "Sign In" ? (
            <p>
              New to Netflix?{" "}
              <span className="signup" onClick={() => setSignState("Sign Up")}>
                Sign up now
              </span>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <span onClick={() => setSignState("Sign In")}>Sign in</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
