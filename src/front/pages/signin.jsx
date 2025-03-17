import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";


export const Signin = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const { store, actions } = useGlobalReducer();
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden.");
            return;
        }

        if (store.emailError) {
            setError(store.emailError);
            return;
        }

        try {
            const result = await actions.register({ username, email, password });
            if (result.register) {
                navigate("/private");
              } else {
                setError("Registration failed. Please try again."); 
              }
        } catch (err) {
            setError(err.message);
        }
    };

    // Función para verificar el correo al cambiar
    const handleEmailChange = (e) => {
        const email = e.target.value;
        setEmail(email);
        actions.checkEmail(email);
    };

    return (
        <div className="container">
            <h2>Registro</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleRegister}>
                <div className="mb-3">
                    <label htmlFor="username" className="form-label">Nombre</label>
                    <input
                        type="text"
                        className="form-control"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Correo Electrónico</label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        value={email}
                        onChange={handleEmailChange}
                        required
                    />
                    {store.emailError && <div className="alert alert-danger">{store.emailError}</div>}
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Contraseña</label>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="confirmPassword" className="form-label">Confirmar Contraseña</label>
                    <input
                        type="password"
                        className="form-control"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary" disabled={store.emailError}>Registrar</button>
            </form>
            <div className="mt-3">
                <p className="text-center">
                    ¿Ya tienes cuenta? <Link to="/login" className="text-sucess">Ingresa</Link>
            </p>
        </div>
        </div >
    );
};