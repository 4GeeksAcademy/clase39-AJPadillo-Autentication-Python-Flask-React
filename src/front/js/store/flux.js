const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: "",
			token: "",
			user: "",
			users: []
		},
		actions: {
			getUsers: async () => {
				const store = getStore();
				try {
					const response = await fetch("https://miniature-space-journey-q59965r6xrwcxjrx-3001.app.github.dev/api/users", {
						method: "GET",
						headers: {
							"Content-Type": "application/json"
						}
					});
					if (response.status === 200) {
						const data = await response.json();
						store.users = data; // Asigna directamente a la propiedad del store
						setStore(store); // Guarda el estado
						console.log(store.users);
					} else {
						console.log("Fallo al hacer fetch (flux.js)");
					}
				} catch (error) {
					console.log("Fallo al hacer fetch (flux.js):", error);
				}
			},

			login: async (email, password) => {
				try {
					const response = await fetch("https://miniature-space-journey-q59965r6xrwcxjrx-3001.app.github.dev/api/login", {
						method: "POST",
						headers: {
							"Content-Type": "application/json"
						},
						body: JSON.stringify({ email: email, password: password })
					});
					if (response.status === 200) {
						const data = await response.json();
						const store = getStore();
						store.token = data.access_token; // Asigna directamente al store
						setStore(store); // Guarda el estado
						console.log("Login successful");
						console.log("Token:", data.access_token);
					} else {
						console.log("Login erroneo: Email or password invalidos");
					}
				} catch (error) {
					console.error("Error al logear (flux.js):", error);
				}
			},

			getCurrentUser: async () => {
				const store = getStore();
				const token = localStorage.getItem("token");
				if (token !== null) {
					try {
						const response = await fetch("https://miniature-space-journey-q59965r6xrwcxjrx-3001.app.github.dev/api/current-user", {
							method: "GET",
							headers: {
								"Content-Type": "application/json",
								Authorization: "Bearer " + token
							}
						});
						if (response.status === 200) {
							const data = await response.json();
							store.user = data.current_user; // Asigna directamente al store
							setStore(store); // Guarda el estado
						} else {
							console.error("Error al hacer fetch al usuario actual");
						}
					} catch (error) {
						console.error("Error al hacer fetch al usuario actual:", error);
					}
				} else {
					console.log("Falta el token");
				}
			},

			getMessage: async () => {
				try{
					// fetching data from the backend
					const resp = await fetch(process.env.BACKEND_URL + "/api/hello")
					const data = await resp.json()
					setStore({ message: data.message })
					// don't forget to return something, that is how the async resolves
					return data;
				}catch(error){
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
