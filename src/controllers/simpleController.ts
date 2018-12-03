import {Get, Route, Controller, Post, Body, Path, Header, BodyProp, Tags} from "valory-runtime";

/**
 * You can use interfaces as models.
 * This message will show up as a description.
 */
export interface Item {
	/**
	 * You can also add validations and examples to individual properties
	 * @example "squirtle"
	 * @maxLength 20
	 * @minLength 10
	 */
	someField: string;
	// Optional fields mean exactly what you expect.
	optionalField?: string;
	aNumber: number;
}

// You can also use classes. This has the added benefit of supporting default values.
export class DataClass {
	// This field will have a default value
	public name = "Kerim";
	/**
	 * Normal fields and validation still work
	 * @maximum -1
	 */
	public coolness: number;

	// private fields will be hidden
	private other: string;
}

// User the Route decorator to register a class as a Controller.
// Additionally, you can extend Controller to get access to useful features.
@Route("base") @Tags("Simple") export class SimpleController extends Controller {
	/**
	 * Swagger endpoint description
	 * @summary swagger summary
	 */
	@Get("some/path") public someHandler() {
		return "Some response";
	}

	// Function arguments can be injected from request object
	@Get("{name}") public async someOtherHandler(@Path() name: string, @Header() authorization: string): Promise<string> {
		return `name is ${name}`;
	}

	// even complex types work
	@Post("submit") public submit(@Body() input: Item): {content: Item} {
		// set the status code
		this.setStatus(418);

		// access request logger
		this.logger.info("yay!");

		return {
			content: input,
		};
	}

	// You can specify parameters as properties in the body
	@Post("props") public bodyProps(@BodyProp() item: Item, @BodyProp() data: DataClass) {
		return `${item.someField} ${data.name} ${item.aNumber}`;
	}

	// The Tags decorator can be used on both endpoints and controllers
	@Tags("Tagged")
	@Get("tagged") public tagged() {
		return "yay";
	}

	// Controllers are normal classes, so you can include any additional properties and methods you want
	private doSomething() {
		return "it did something";
	}
}
