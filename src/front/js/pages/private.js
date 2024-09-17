import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import "../../styles/home.css";

export const FavoritesCard = ({ imageMapCharacters, imageMapPlanets, handlePlanets, handleCharacters, actions }) => {
    const { store } = useContext(Context);
    const navigate = useNavigate();

    const withSession = !!store?.isLoggedIn;
    console.log(store.favorites);

    useEffect(() => {
        if (!withSession) {
            navigate("/login");
        }
    }, [withSession, navigate]);
    if (!store.favorites || !Array.isArray(store.favorites)) {
        return <div>No favorites available.</div>;
    }
    const personas = store.personas || [];
    const planetas = store.planetas || [];

    const renderFavorites = () => {
        return store.favorites.map((item, index) => {
            if (item.type === "people") {
                return renderPerson(item, index);
            } else if (item.type === "planet") {
                return renderPlanet(item, index);
            }
            return null;
        });
    };

    const renderPerson = (item, index) => {
        const person = personas.find(p => p.id === item.id);
        return person ? (
            <div className="col-md-3" key={index}>
                <div className="card" style={{ height: "100%" }}>
                    <img src={imageMapCharacters[person.name]} className="card-img-top" alt={person.name} />
                    <div className="card-body">
                        <h5 className="card-title">{person.name}</h5>
                        <p className="card-text">Height: {person.height}</p>
                        <p className="card-text">Birth Year: {person.birth_year}</p>
                        <p className="card-text">Eye color: {person.eye_color}</p>
                        <div className="d-flex justify-content-around">
                            <button onClick={() => handleCharacters(person)} className="btn btn-primary">Learn more!</button>
                            <button onClick={() => actions.toggleFavorites(person.id, "people")} className="btn btn-warning">
                                {actions.isFavorite(person.id, "people") ? '❤️' : '🖤'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        ) : null;
    };

    const renderPlanet = (item, index) => {
        const planet = planetas.find(p => p.id === item.id);
        return planet ? (
            <div className="col-md-3" key={index}>
                <div className="card" style={{ height: "100%" }}>
                    <img src={imageMapPlanets[planet.name]} className="card-img-top" alt={planet.name} />
                    <div className="card-body">
                        <h5 className="card-title">{planet.name}</h5>
                        <p className="card-text">Population: {planet.population}</p>
                        <p className="card-text">Climate: {planet.climate}</p>
                        <p className="card-text">Terrain: {planet.terrain}</p>
                        <div className="d-flex justify-content-around">
                            <button onClick={() => handlePlanets(planet)} className="btn btn-primary">Learn more!</button>
                            <button onClick={() => actions.toggleFavorites(planet.id, "planet")} className="btn btn-warning">
                                {actions.isFavorite(planet.id, "planet") ? '❤️' : '🖤'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        ) : null;
    };
    return (
        <div className="row d-flex flex-nowrap flex-row overflow-scroll overflow-y-hidden">
            {renderFavorites()}
        </div>
    );
};
