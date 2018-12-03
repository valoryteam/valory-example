import {Logger} from "pino";
import {ApiMiddleware, ApiRequest, ApiResponse, Swagger, Valory} from "valory-runtime";
import {verify} from "jsonwebtoken";

export interface AuthData {
	token: string;
	data: {
		username: string;
		email: string;
	};
}

// Middleware are simply objects that satisfy ApiMiddleware.
export class AuthMiddleware implements ApiMiddleware {
	// You can use attachment keys to store data of a specific type on the request for use later.
	// It's best practice to make these static properties of the class that creates them.
	public static AuthDataKey = ApiRequest.createKey<AuthData>();

	// Used mostly for logging
	public name = "AuthMiddleware";

	// Tag (or Tags) will be applied to every endpoint that uses this middleware
	public tag: Swagger.Tag = {
		description: "Authorization required",
		name: "Restricted",
	};

	// This is a normal class, so do whatever in the constructor
	constructor(private secret: Buffer, private header = "Authorization") {}

	public handler(request: ApiRequest, logger: Logger, done: (err?: ApiResponse) => void) {
		// Get the valory instance
		const app = Valory.getInstance();
		
		// Since this will run pre-validation, we have to ensure the header is there
		if (request.headers[this.header] == null) {
			// We ask the Valory instance to build an ApiResponse based on the given error definition.
			// Calling done with a value will skip the request handler.
			done(app.buildError("AuthFailure", "Auth header missing"));
			return;
		}

		// We expect the header to be in the format "Token xxxxxx.xxxxxx.xxxxxx"
		const headerContent: string = request.headers[this.header];
		const parsed = headerContent.split(" ");

		// There should be two indexes
		if (parsed.length !== 2) {
			done(app.buildError("AuthFailure", "Malformed auth header"));
			return;
		}

		// The parsed token should be in index 1
		const token = parsed[1];

		verify(token, this.secret, (err, decoded) => {
			if (err != null) {
				done(app.buildError("AuthFailure", "Authorization Denied"));
			}

			// If there was no error, auth was successful. Now we just attach the decoded data to
			// the request with our key.
			request.putAttachment(AuthMiddleware.AuthDataKey, {
				token,
				data: decoded,
			});

			// Call done with no args to finish.
			done();
		});
	}
}
