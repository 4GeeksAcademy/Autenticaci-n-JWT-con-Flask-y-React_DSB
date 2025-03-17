import React, { useState } from "react";
import {Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { actions } = useGlobalReducer();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    const result = await actions.login(email, password);
  
    // Verifica si el login fue exitoso
    if (result.login) {
      navigate("/private"); 
    } else {
      setError("Login failed. Please check your credentials."); 
    }
  };
  

  return (
    <div className="container">
      <h2>Login</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input type="email" className="form-control" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input type="password" className="form-control" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit" className="btn btn-primary">Login</button>
      </form>
      <div className="mt-3">
        <p className="text-center">
          ¿No tienes cuenta? <Link to="/register" className="text-sucess">Registrate</Link>
        </p>
      </div>
    </div>
  );
};