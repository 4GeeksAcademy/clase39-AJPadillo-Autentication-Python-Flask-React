import React from "react";

export const CharactersCard = ({ store, actions, imageMapCharacters }) => {
    return (
        <div className="row d-flex flex-nowrap flex-row overflow-scroll overflow-y-hidden">
            {store.personas.map((item, index) =>
                <div className="col-md-3" key={index}>
                    <div className="card" style={{ height: "100%" }}>
                        <img src={imageMapCharacters[item.name]} className="card-img-top" alt="..." />
                        <div className="card-body">
                            <h5 className="card-title">{item.name}</h5>
                            <p className="card-text">Height: {item.height}</p>
                            <p className="card-text">Birth Year: {item.birth_year}</p>
                            <p className="card-text">Eye color: {item.eye_color}</p>
                            <div className="d-flex justify-content-around">
                                <button onClick={() => handleCharacters(item)} className="btn btn-primary">Learn more!</button>
                                <button onClick={() => actions.toggleFavorites(item.id, "people")} className="btn btn-warning">{actions.isFavorite(item.id, "people") ? '❤️' : '🖤'}</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};