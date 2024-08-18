import React from "react";

export const PlanetsCard = ({ store, actions, imageMapPlanets, handlePlanets }) => {
    return (
        <div className="row d-flex flex-nowrap flex-row overflow-scroll overflow-y-hidden">
            {store.planetas.map((item, index) =>
                <div className="col-md-3" key={index}>
                    <div className="card" style={{ height: "100%" }}>
                        <img src={imageMapPlanets[item.name]} className="card-img-top" alt="..." />
                        <div className="card-body">
                            <h5 className="card-title">{item.name}</h5>
                            <p className="card-text">Population: {item.population}</p>
                            <p className="card-text">Climate: {item.climate}</p>
                            <div className="d-flex justify-content-around">
                                <button onClick={() => handlePlanets(item)} className="btn btn-primary">Learn more!</button>
                                <button onClick={() => actions.toggleFavorites(item.id, "planet")} className="btn btn-warning">{actions.isFavorite(item.id, "planet") ? '❤️' : '🖤'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}