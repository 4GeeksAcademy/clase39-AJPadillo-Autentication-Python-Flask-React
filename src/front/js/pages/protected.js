import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom"; // Importar useNavigate para la redirección
import rigoImageUrl from "../../img/rigo-baby.jpg";
import "../../styles/home.css";

export const Protected = () => {
    const { store, actions } = useContext(Context);
    const withSession = !!store?.isLoggedIn;
    const navigate = useNavigate();
    useEffect(() => {
        if (!withSession) {
            navigate("/login");
        }
    }, [withSession]);
    return (
        <div className="text-center mt-5">
            <h1>Protected Page</h1>
            <p>
                <img src={rigoImageUrl} alt="Rigo Baby" />
            </p>
            <div className="alert alert-info">
                {store.user?.email || "Loading message from the backend (make sure your python backend is running)..."}
            </div>
            <p>
                This boilerplate comes with lots of documentation:{" "}
                <a href="https://start.4geeksacademy.com/starters/react-flask">
                    Read documentation
                </a>
            </p>
        </div>
    );
};
