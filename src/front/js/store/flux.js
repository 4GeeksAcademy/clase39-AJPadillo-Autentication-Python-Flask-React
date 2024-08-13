const getState = ({ getStore, getActions, setStore }) => {
	return {
		// Estado inicial de la aplicación (store)
		store: {
			message: "",  // Mensaje que puede ser actualizado y mostrado en la interfaz
			token: "",    // Token de autenticación, utilizado para identificar al usuario
			user: "",     // Información del usuario actualmente autenticado
			users: []     // Lista de usuarios en la aplicación
		},
		// Acciones que pueden ser ejecutadas para cambiar el estado
		actions: {
			// Acción para obtener la lista de usuarios desde la API
			getUsers: async () => {
				// Obtiene el estado actual
				const store = getStore();
				try {
					// Realiza una petición GET a la API para obtener los usuarios
					const response = await fetch("https://miniature-space-journey-q59965r6xrwcxjrx-3001.app.github.dev/api/users", {
						method: "GET",
						headers: {
							"Content-Type": "application/json"
						}
					});
					if (response.status === 200) {  // Si la respuesta es exitosa
						const data = await response.json();  // Convierte la respuesta a JSON
						store.users = data; // Asigna los usuarios obtenidos al store
						setStore(store); // Actualiza el store con la nueva lista de usuarios
						console.log(store.users);  // Muestra los usuarios en la consola
					} else {
						console.log("Fallo al hacer fetch getUsers(flux.js)");  // Muestra un error si la petición falla
					}
				} catch (error) {
					console.log("Fallo al hacer fetch getUsers (flux.js):", error);  // Muestra el error en caso de excepción
				}
			},

			// Acción para hacer login en la aplicación
			login: async (email, password) => {
				try {
					// Realiza una petición POST a la API para autenticar al usuario
					const response = await fetch("https://miniature-space-journey-q59965r6xrwcxjrx-3001.app.github.dev/api/login", {
						method: "POST",
						headers: {
							"Content-Type": "application/json"
						},
						body: JSON.stringify({ email: email, password: password })  // Envia email y contraseña en el cuerpo de la solicitud
					});
					if (response.status === 200) {  // Si la autenticación es exitosa
						const data = await response.json();  // Convierte la respuesta a JSON
						const store = getStore();  // Obtiene el estado actual
						store.token = data.access_token; // Guarda el token de acceso en el store
						setStore(store); // Actualiza el store con el nuevo token
						console.log("Login successful");  // Muestra un mensaje de éxito en la consola
						console.log("Token:", data.access_token);  // Muestra el token en la consola
					} else {
						console.log("Login erroneo: Email or password invalidos");  // Muestra un error si las credenciales son incorrectas
					}
				} catch (error) {
					console.error("Error al logear (flux.js):", error);  // Muestra un error en caso de excepción
				}
			},

			// Acción para obtener los datos del usuario actualmente autenticado
			getCurrentUser: async () => {
				const store = getStore();  // Obtiene el estado actual
				const token = localStorage.getItem("token");  // Intenta obtener el token desde el almacenamiento local
				if (token !== null) {  // Si el token existe
					try {
						// Realiza una petición GET a la API para obtener la información del usuario
						const response = await fetch("https://miniature-space-journey-q59965r6xrwcxjrx-3001.app.github.dev/api/current-user", {
							method: "GET",
							headers: {
								"Content-Type": "application/json",
								Authorization: "Bearer " + token  // Incluye el token en la cabecera de autorización
							}
						});
						if (response.status === 200) {  // Si la respuesta es exitosa
							const data = await response.json();  // Convierte la respuesta a JSON
							store.user = data.current_user; // Guarda los datos del usuario en el store
							setStore(store); // Actualiza el store con la nueva información del usuario
						} else {
							console.error("Error al hacer fetch al usuario actual");  // Muestra un error si la petición falla
						}
					} catch (error) {
						console.error("Error al hacer fetch al usuario actual:", error);  // Muestra un error en caso de excepción
					}
				} else {
					console.log("Falta el token");  // Muestra un mensaje si el token no está presente
				}
			},

			// Función para crear un nuevo usuario
			createUser: async (email, password) => {
				// Obtener la URL base para la API
				const url = "https://miniature-space-journey-q59965r6xrwcxjrx-3001.app.github.dev/api/signup";
				// Definir el objeto con las opciones de la solicitud fetch
				const options = {
					method: "POST", // Especifica que la solicitud es de tipo POST
					headers: {
						"Content-Type": "application/json", // Especifica que el contenido es JSON
					},
					body: JSON.stringify({
						email: email, // Incluye el email en el cuerpo de la solicitud
						password: password // Incluye la contraseña en el cuerpo de la solicitud
					}),
				};
				try {
					// Realiza la solicitud a la API usando fetch
					const response = await fetch(url, options);
					// Verifica si la respuesta es exitosa (código de estado 200-299)
					if (response.ok) {
						const data = await response.json(); // Parsear la respuesta como JSON
						console.log("Usuario creado exitosamente:", data);
						return true; // Retorna true si la creación fue exitosa
					} else {
						// Si la respuesta no es exitosa, lanza un error
						const errorData = await response.json(); // Parsear la respuesta como JSON
						console.error("Error al crear usuario:", errorData.message);
						return false; // Retorna false si hubo un error
					}
				} catch (error) {
					// Captura y muestra errores en la consola
					console.error("Error al crear usuario:", error);
					return false; // Retorna false si hubo un error durante la solicitud
				}
			},

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
			},

			// Use getActions to call a function within a fuction
			// exampleFunction: () => {
			// 	getActions().changeColor(0, "green");
			// },

			// changeColor: (index, color) => {
			// 	//get the store
			// 	const store = getStore();

			// 	//we have to loop the entire demo array to look for the respective index
			// 	//and change its color
			// 	const demo = store.demo.map((elm, i) => {
			// 		if (i === index) elm.background = color;
			// 		return elm;
			// 	});

			// 	//reset the global store
			// 	setStore({ demo: demo });
			// }
		}
	};
};

export default getState;
