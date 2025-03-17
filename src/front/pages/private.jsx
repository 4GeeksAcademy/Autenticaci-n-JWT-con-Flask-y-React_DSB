import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import PhoneInput from 'react-phone-number-input';

import "react-phone-number-input/style.css"
export const Private = () => {
    const { store, actions } = useGlobalReducer();
    const [userData, setUserData] = useState({
        username: "",
        email: "",
        phone: "",
    });

    const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [error, setError] = useState("");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [confirmText, setConfirmText] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (!store.user) {
            navigate("/login");
        } else {
            setUserData({
                username: store.user.username,
                email: store.user.email,
                phone: store.user.phone || "",
            });
        }
    }, []);


    const handleUpdateProfile = async (e) => {
        e.preventDefault();

        try {
            const result = await actions.updateProfile(userData, password, newPassword);
            if (result.update) {
                alert("Perfil actualizado correctamente");
            } else {
                setError("Error al actualizar el perfil");
            }
        } catch (err) {
            setError(err.message);
        }
    };
    const handleDeleteUser = async () => {
        if (confirmText !== "ELIMINAR") {
            setError("Debes escribir 'ELIMINAR' para confirmar.");
            return;
        }

        try {
           
            const result = await actions.deleteUser();
            if (result.delete) {
                alert("Usuario eliminado correctamente.");
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                navigate("/"); 
            } else {
                setError("Error al eliminar el usuario.");
            }
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="container">
        <h2>Bienvenido a tu página privada</h2>
        <p>Estos son tus datos actuales:</p>
        <div className="mb-3">
            <strong>Nombre:</strong> {userData.username}
        </div>
        <div className="mb-3">
            <strong>Correo Electrónico:</strong> {userData.email}
        </div>
        <div className="mb-3">
            <strong>Teléfono:</strong> {userData.phone || "No disponible"}
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <h3>Actualizar tu perfil</h3>
        <form onSubmit={handleUpdateProfile}>
            <div className="mb-3">
                <label htmlFor="username" className="form-label">
                    Nombre
                </label>
                <input
                    type="text"
                    className="form-control"
                    id="username"
                    value={userData.username}
                    onChange={(e) => setUserData({ ...userData, username: e.target.value })}
                    required
                />
            </div>
            <div className="mb-3">
                <label htmlFor="email" className="form-label">
                    Correo Electrónico
                </label>
                <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={userData.email}
                    onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                    required
                />
            </div>
            <div className="mb-3">
                    <label htmlFor="phone" className="form-label">
                        Teléfono
                    </label>
                    <PhoneInput
                        defaultCountry="ES" 
                        value={userData.phone}
                        onChange={(phone) => setUserData({ ...userData, phone })}
                        className="form-control"
                        id="phone"
                    />
                </div>
            <div className="mb-3">
                <label htmlFor="password" className="form-label">
                    Contraseña Actual
                </label>
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
                <label htmlFor="newPassword" className="form-label">
                    Nueva Contraseña
                </label>
                <input
                    type="password"
                    className="form-control"
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />
            </div>
            <button type="submit" className="btn btn-primary">
                Actualizar Perfil
            </button>
        </form>
     {/* Botón para eliminar el usuario */}
     <button className="btn btn-danger mt-3" onClick={() => setIsModalVisible(true)}>
                Eliminar Usuario
            </button>

            {/* Modal de confirmación para eliminar usuario */}
            {isModalVisible && (
                <div className="modal" tabIndex="-1" style={{ display: 'block', zIndex: 1050 }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Confirmar Eliminación</h5>
                                <button type="button" className="btn-close" onClick={() => setIsModalVisible(false)}></button>
                            </div>
                            <div className="modal-body">
                                <p>Escribe <strong>ELIMINAR</strong> para eliminar tu usuario.</p>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={confirmText}
                                    onChange={(e) => setConfirmText(e.target.value)}
                                />
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setIsModalVisible(false)}>
                                    Cerrar
                                </button>
                                <button type="button" className="btn btn-danger" onClick={handleDeleteUser}>
                                    Eliminar Usuario
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};