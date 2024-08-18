const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: "",
			token: "",
			currentUser: null,
			isLoggedIn: false,
			users: [],
			personas: [],
			planetas: [],
			favorites: []
		},
		actions: {
			// Acción para hacer login en la aplicación
			login: async (email, password) => {
				try {
					const response = await fetch("https://miniature-space-journey-q59965r6xrwcxjrx-3001.app.github.dev/api/login", {
						method: "POST",
						headers: {
							"Content-Type": "application/json"
						},
						body: JSON.stringify({ email, password }) // Envía el email y el password como un objeto JSON en el cuerpo de la solicitud
					});
					if (response.status === 200) { // Verifica si la respuesta de la API fue exitosa (código 200)
						const data = await response.json(); // Convierte la respuesta en formato JSON
						const accessToken = data.access_token;
						if (accessToken) {
							localStorage.setItem("accessToken", accessToken); // Guarda el token recibido en el localStorage del navegador
							await getActions().getCurrentUser(); // Obtiene la información del usuario actual
							console.log("Login successful"); // Mensaje de éxito en la consola
							console.log("Token:", data.access_token); // Muestra el token en la consola
							return true;
						}
						return false;
					}
				} catch (error) {
					console.error("Error al logear (flux.js):", error); // Captura y muestra cualquier error que ocurra durante el proceso
				}
			},

			// Acción para obtener los datos del usuario actualmente autenticado
			getCurrentUser: async () => {
				try {
					// Obtener el token de acceso desde el localStorage
					const accessToken = localStorage.getItem("accessToken");
					// Realizar la solicitud GET a la API usando fetch
					const response = await fetch("https://miniature-space-journey-q59965r6xrwcxjrx-3001.app.github.dev/api/current-user", {
						method: "GET", // Método de la solicitud
						headers: {
							// Incluir el token en los encabezados de la solicitud para la autenticación
							Authorization: `Bearer ${accessToken}`, // Enviar el JWT en los headers
							"Content-Type": "application/json" // Especificar el tipo de contenido como JSON
						}
					});
					// Verificar si la respuesta fue exitosa
					if (response.status === 200) {
						const data = await response.json(); // Parsear la respuesta como JSON
						console.log(data);

						const currentUser = data.current_user; // Extraer el usuario actual de la respuesta
						setStore({ currentUser, isLoggedIn: true }); // Actualizar el store con el usuario actual y marcar como logueado
					} else {
						throw new Error("Failed to fetch current user"); // Manejo de errores si la respuesta no fue exitosa
					}
				} catch (error) {
					console.log("Error loading message from backend", error); // Mostrar el error en la consola
					localStorage.removeItem("accessToken"); // Remover el token de acceso si hay un error
					setStore({
						currentUser: null, // Establecer el usuario actual como nulo en el store
						isLoggedIn: false, // Marcar como no logueado
					});
				}
			},

			// Función para crear un nuevo usuario
			createUser: async (email, password) => {
				try {
					const response = await fetch("https://miniature-space-journey-q59965r6xrwcxjrx-3001.app.github.dev/api/signup", {
						method: "POST", // Especifica que la solicitud es de tipo POST
						headers: {
							"Content-Type": "application/json", // Especifica que el contenido es JSON
						},
						body: JSON.stringify({
							email, // Incluye el email en el cuerpo de la solicitud
							password // Incluye la contraseña en el cuerpo de la solicitud
						}),
					});
					if (response.status === 200) { // Verifica si la respuesta es exitosa
						const data = await response.json(); // Transformar la respuesta como JSON
						console.log("Usuario creado:", data);
						return true; // Retorna true si la creación fue exitosa
					} else {
						// Si la respuesta no es exitosa, lanza un error
						const errorData = await response.json(); // Transformar la respuesta como JSON
						console.error("Error al crear usuario:", errorData.message);
						return false; // Retorna false si hubo un error
					}
				} catch (error) {
					console.error("Error al crear usuario:", error); // Captura y muestra errores en la consola
					return false; // Retorna false si hubo un error durante la solicitud
				}
			},

			// Acción para cerrar sesión
			logout: () => {
				localStorage.removeItem("accessToken"); // Elimina el token del localStorage
				setStore({
					currentUser: null, // Establece el usuario actual como nulo en el store
					isLoggedIn: false, // Marcar como no logueado
				});
			},

			// Obtener personajes desde la API personalizada
			getCharacters: async () => {
				try {
					const response = await fetch("https://miniature-space-journey-q59965r6xrwcxjrx-3001.app.github.dev/api/people", {
						method: "GET",
						headers: {
							"Content-Type": "application/json"
						}
					});
					if (response.status === 200) {
						const data = await response.json();
						setStore({ personas: data }); // Guarda la lista de personajes en el store
					} else {
						console.error("Error fetching characters");
					}
				} catch (error) {
					console.error("Error fetching characters:", error);
				}
			},

			// Obtener detalles de un personaje específico
			getCharactersInfo: async (id) => {
				try {
					const response = await fetch(`https://miniature-space-journey-q59965r6xrwcxjrx-3001.app.github.dev/api/people/${id}`, {
						method: "GET",
						headers: {
							"Content-Type": "application/json"
						}
					});
					if (response.status === 200) {
						const data = await response.json();
						return data.result; // Devuelve los detalles del personaje
					} else {
						console.error("Error fetching character info");
					}
				} catch (error) {
					console.error("Error fetching character info:", error);
				}
			},

			// Obtener planetas desde la API personalizada
			getPlanets: async () => {
				try {
					const response = await fetch("https://miniature-space-journey-q59965r6xrwcxjrx-3001.app.github.dev/api/planets", {
						method: "GET",
						headers: {
							"Content-Type": "application/json"
						}
					});
					if (response.status === 200) {
						const data = await response.json();
						setStore({ planetas: data }); // Guarda la lista de planetas en el store
					} else {
						console.error("Error fetching planets");
					}
				} catch (error) {
					console.error("Error fetching planets:", error);
				}
			},

			// Obtener detalles de un planeta específico
			getPlanetsInfo: async (id) => {
				try {
					const response = await fetch(`https://miniature-space-journey-q59965r6xrwcxjrx-3001.app.github.dev/api/planets/${id}`, {
						method: "GET",
						headers: {
							"Content-Type": "application/json"
						}
					});
					if (response.status === 200) {
						const data = await response.json();
						return data.result; // Devuelve los detalles del planeta
					} else {
						console.error("Error fetching planet info");
					}
				} catch (error) {
					console.error("Error fetching planet info:", error);
				}
			},
			////////////////////////////////////// TOOGLE ESTA DANDO ERROR AL POSTEAR FAVORITOS - ¿TYPE UNDEFINED? /////////////////////////////////////
			// Acción para agregar o eliminar favoritos
			toggleFavorites: async (id, type) => {
				try {
					const accessToken = localStorage.getItem("accessToken");
					const store = getStore();
					const favorites = store.favorites || [];
					console.log("Favorites:", favorites, Array.isArray(favorites)); // Depurar favorites para ver si es array
					const isFavorite = favorites.some(fav => fav.id === id && fav.type === type);
					const options = {
						method: isFavorite ? "DELETE" : "POST",
						headers: {
							Authorization: `Bearer ${accessToken}`,
							"Content-Type": "application/json",
						},
					};
					const url = `https://miniature-space-journey-q59965r6xrwcxjrx-3001.app.github.dev/api/favorite/${type}/${id}`;
					const response = await fetch(url, options);

					if (response.ok) {
						// Actualiza la lista de favoritos con la respuesta del backend
						const updatedFavorites = await response.json();
						setStore({ favorites: updatedFavorites }); // Actualiza el estado global con los nuevos favoritos
					} else {
						console.error("Error al actualizar favoritos (flux.js):", response.status);
					}
				} catch (error) {
					console.error("Error en la solicitud:", error);
				};
			},

			// Función para obtener los favoritos del usuario
			getUserFavorites: async () => {
				const accessToken = localStorage.getItem("accessToken");
				const store = getStore();
				setStore({ favorites: store.favorites})
				if (!accessToken) {
					console.error("User is not authenticated");
					return;
				}
				try {
					const response = await fetch("https://miniature-space-journey-q59965r6xrwcxjrx-3001.app.github.dev/api/users/favorites", {
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${accessToken}`,
						},
					});
					if (response.status === 200) {
						const data = await response.json();
						const favorites = [
							...data.favorite_planets.map(planet => ({ id: planet.id, name: planet.name, type: "planet" })),
							...data.favorite_people.map(person => ({ id: person.id, name: person.name, type: "people" }))
						];
						setStore({ favorites });
					} else {
						console.error("Error fetching user favorites");
					}
				} catch (error) {
					console.error("Error fetching user favorites:", error);
				}
			},

			removeFavorites: (id) => {
				const store = getStore();
				setStore({ favorites: store.favorites.filter(element => element.id !== id) });
			},

			isFavorite: (id, type) => {
				const store = getStore();
				const favorites = store.favorites || [];
				return favorites.some(favorite => favorite.id === id && favorite.type === type);
			},
		}
	};
};

export default getState;
