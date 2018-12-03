import {ApiRequest, Controller, Get, Middleware, Post, Route, Request, Tags} from "valory-runtime";
import {AuthMiddleware} from "../middleware/authMiddleware";

// Instantiate our middleware.
// NOTE: Obviously don't use static secrets embedded in your source.
const auth = new AuthMiddleware(Buffer.from("secret"));

// We can apply middleware to every endpoint in a controller at once
@Middleware(auth)
@Route("authorized") export class AuthorizedController extends Controller {
	// All endpoints in here will have auth applied
	@Get() public simpleGet() {
		return "yay";
	}

	// We can use the request object to access attachments
	@Post("data") public getData(@Request() request: ApiRequest) {
		// Use the static key from AuthMiddleware to retrieve the token data attachment
		const authData = request.getAttachment(AuthMiddleware.AuthDataKey);

		// Because the key stores type, all attachments are typesafe
		console.log(`Got request with token: ${authData.token}`);

		return authData.data;
	}
}
