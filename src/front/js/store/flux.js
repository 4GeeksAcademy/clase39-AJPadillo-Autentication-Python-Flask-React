const getState = ({ getStore, getActions, setStore }) => {
	return {
		// Estado inicial de la aplicación (store)
		store: {
			message: "",  // Mensaje que puede ser actualizado y mostrado en la interfaz
			token: "",    // Token de autenticación, utilizado para identificar al usuario
			currentUser: null,  // Información del usuario actualmente autenticado
			isLoggedIn: false,   // Indicador de si el usuario está autenticado
			users: [],     // Lista de usuarios en la aplicación
			personas: [],
            planetas: [],
            vehiculos: [],
            favorites: []
		},
		// Acciones que pueden ser ejecutadas para cambiar el estado
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
							Authorization: `Bearer ${accessToken}`,
							"Content-Type": "application/json" // Especificar el tipo de contenido como JSON
						}
					});
					// Verificar si la respuesta fue exitosa
					if (response.ok) {
						const data = await response.json(); // Parsear la respuesta como JSON
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

			getCharacters: async () => {
                try {
                    const response = await fetch("https://www.swapi.tech/api/people/");
                    const data = await response.json();
                    const personas = await Promise.all(data.results.map(async (character) => {
                        const details = await getActions().getCharactersInfo(character.uid);
                        const { properties, ...basicInfo } = details;
                        return {
                            ...properties,
                            ...basicInfo,
                        }
                    }));
                    setStore({ personas: personas });
                } catch (error) {
                    console.log(error);
                }
            },

            getCharactersInfo: async (id) => {
                try {
                    const response = await fetch(`https://www.swapi.tech/api/people/${id}`);
                    const data = await response.json();
                    return data.result;
                } catch (error) {
                    console.log(error);
                }
            },

            getPlanets: async () => {
                try {
                    const response = await fetch("https://www.swapi.tech/api/planets/");
                    const data = await response.json();
                    const planetas = await Promise.all(data.results.map(async (planet) => {
                        const details = await getActions().getPlanetsInfo(planet.uid);
                        const { properties, ...basicInfo } = details;
                        return {
                            ...properties,
                            ...basicInfo,
                        }
                    }));
                    setStore({ planetas: planetas });
                } catch (error) {
                    console.log(error);
                }
            },

            getPlanetsInfo: async (id) => {
                try {
                    const response = await fetch(`https://www.swapi.tech/api/planets/${id}`);
                    const data = await response.json();
                    return data.result;
                } catch (error) {
                    console.log(error);
                }
            },

			toggleFavorites: (customUid, name) => {
                const store = getStore();
                const found = store.favorites.find((element) => element.uid === customUid);
                if (!found) {
                    setStore({ favorites: [...store.favorites, { uid: customUid, name }] });
                } else {
                    getActions().removeFavorites(customUid);
                }
            },

            removeFavorites: (customUid) => {
                const store = getStore();
                setStore({ favorites: store.favorites.filter(element => element.uid !== customUid) });
            },

            isFavorite: (uid) => {
                const favorites = getStore().favorites;
                return favorites.some(favorite => favorite.uid === uid);
            },
			
			////////////////////////////////////////////////////////////////////////////////////////////////////////
			// Acción para obtener un mensaje desde el backend
			getMessage: async () => {
				try {
					// fetching data from the backend
					const resp = await fetch(process.env.BACKEND_URL + "/api/hello")
					const data = await resp.json()
					setStore({ message: data.message })
					// don't forget to return something, that is how the async resolves
					return data;
				} catch (error) {
					console.log("Error loading message from backend", error)
				}
			}
		}
	};
};

export default getState;
