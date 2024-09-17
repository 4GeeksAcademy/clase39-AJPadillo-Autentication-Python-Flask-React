import React, { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

export const Navbar = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    // Manejar logout
    const handleLogout = () => {
        actions.logout();
        navigate("/");
    };

    const handleProfileRedirect = () => {
        navigate("/private");
    };

    return (
        <nav className="navbar navbar-light bg-light mb-3">
            <div className="container">
                <Link to="/">
                    <span className="navbar-brand mb-0 h1"><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSz1oxYa16QkYbSAjstrwIqAeIOoRjZuIM4ow&s" style={{ width: "150px" }} /></span>
                </Link>
                <div className="ml-auto d-flex">
                    <div className="m-auto">
                        {store.isLoggedIn && (
                            <p className="mb-0 mx-3">Hola, {store.currentUser.email}</p>
                        )}
                    </div>
                    <div className="m-auto">
                        {store.isLoggedIn && (
                            <button
                            className="btn btn-info mx-3"
                            onClick={handleProfileRedirect}
                        >
                            Cards de favoritos
                        </button>
                        )}
                    </div>
                    {/* Menú desplegable de favoritos solo visible si el usuario está autenticado */}
                    {store.isLoggedIn && (
                        <div className="dropdown">
                            <button
                                className="btn btn-outline-primary dropdown-toggle me-2"
                                type="button"
                                id="dropdownMenuButton"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                Favoritos
                            </button>
                            <ul className="dropdown-menu">
                                {store.favorites.length > 0 ? (store.favorites.map((item, index) => (
                                    <li className="dropdown-item d-flex justify-content-between align-items-center" key={index}>{item.name}<span
                                        className="delete-btn btn btn-sm fs-3"
                                        onClick={() => actions.toggleFavorites(item.id, item.type)}
                                    >
                                        &times;
                                    </span></li>
                                ))) : (
                                    <li className="dropdown-item">Empty</li>
                                )}
                            </ul>
                        </div>
                    )}
                    {/* Botones de inicio de sesión/registro o cerrar sesión según el estado de autenticación */}
                    {!store.isLoggedIn ? (
                        <>
                            <Link to="/login">
                                <button className="btn btn-outline-primary mx-2">Login</button>
                            </Link>
                            <Link to="/signup">
                                <button className="btn btn-outline-secondary">Sign Up</button>
                            </Link>
                        </>
                    ) : (
                        <button className="btn btn-outline-danger" onClick={handleLogout}>Logout</button>
                    )}

                </div>

            </div>
        </nav>
    );
};
