import React, { useState } from "react";
import "./auth.css";

const Auth = () => {
  const [rightPanelActive, setRightPanelActive] = useState(false);
  const [account, setAccount] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleSignUpClick = () => {
    setRightPanelActive(true);
  };

  const handleSignInClick = () => {
    setRightPanelActive(false);
  };

  const handleChange = (e) => {
  setAccount(prev => ({
    ...prev,
    [e.target.name]: e.target.value,
  }));
};

  return (
    <div
      className={`container ${rightPanelActive ? "right-panel-active" : ""}`}
      id="container"
    >
      <div className="form-container sign-up-container">
        <form action="#">
          <h1>Create Account</h1>
          <input type="text" placeholder="User Name" value={account.username} name="username" onChange={handleChange}/>
          <input type="email" placeholder="Email" value={account.email} name="email" onChange={handleChange}/>
          <input type="password" placeholder="Password" value={account.password} name="password" onChange={handleChange}/>
          <button>Sign Up</button>
        </form>
      </div>
      <div className="form-container sign-in-container">
        <form action="#">
          <h1>Sign in</h1>
          <input type="text" placeholder="User Name" value={account.username} name="username" onChange={handleChange}/>
          <input type="password" placeholder="Password" value={account.password} name="password" onChange={handleChange}/>
          <a href="#">Forgot your password?</a>
          <button>Sign In</button>
        </form>
      </div>
      <div className="overlay-container">
        <div className="overlay">
          <div className="overlay-panel overlay-left">
            <h1>Welcome Back!</h1>
            <p>
              To keep connected with us please login with your personal info
            </p>
            <button className="ghost" id="signIn" onClick={handleSignInClick}>
              Sign In
            </button>
          </div>
          <div className="overlay-panel overlay-right">
            <h1>Hello, Friend!</h1>
            <p>Enter your personal details and start journey with us</p>
            <button className="ghost" onClick={handleSignUpClick} id="signUp">
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
