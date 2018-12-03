import {Valory} from "valory-runtime";
import {PolkaAdaptor} from "valory-adaptor-polka";

// Import our controllers
import "./controllers/simpleController";
import "./controllers/authorizedController";
import "./controllers/advancedController";

// Create the Valory singleton
const app = Valory.createInstance({
	server: new PolkaAdaptor(),
	// Swagger info for the server
	info: {
		title: "Test api",
	},
	// Error definitions for the server
	errors: {
		// The key will be later used to reference this error def
		AuthFailure: {
			defaultMessage: "Could not authorize request",
			// Error code is included in the response
			errorCode: 1005,
			// status code is the actual http status
			statusCode: 200,
		},
	},
});

// Start Valory
app.start({port: 8080});
