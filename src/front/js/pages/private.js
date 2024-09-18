import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import "../../styles/home.css";

export const FavoritesCard = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    const withSession = !!store?.isLoggedIn;

    useEffect(() => {
        if (!withSession) {
            navigate("/login");
        }
    }, [withSession, navigate]);

    if (!store.favorites || !Array.isArray(store.favorites) || store.favorites.length === 0) {
        return <div className="text-center"><h1 className="font-monospace">No favorites available.</h1></div>;
    }

    return (
        <div className="container">
                <div className="row d-flex flex-wrap align-items-center text-center">
                    {store.favorites.map((item, index) => (
                        <div className="col-md-3 mb-3" key={index}>
                            <div className="card h-100">
                                <div className="card-body">
                                    <h5 className="card-title">{item.name}</h5>
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => actions.toggleFavorites(item.id, item.type)}
                                    >
                                        Remove from favorites
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
        </div>
    );
};
