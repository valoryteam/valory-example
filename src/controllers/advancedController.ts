import {Controller, Get, Route, Path, Query, Post, Body, Tags, Middleware} from "valory-runtime";

/**
 * Description can be added to alias types
 * @example "potato"
 */
export type AliasType = string;

export enum PrimaryColors {
	Red = "red",
	Blue = "blue",
	Yellow = "yellow",
}

export interface ModelWithEnums {
	literal: "cool" | "uncool";
	enum: PrimaryColors;
}

// Generics can be used to simplify standardization. This is an example of
// using a generic to create a standard response format.
export interface ApiRes<T> {
	status_code: number;
	response_data: T;
}

/**
 * Discriminated Unions can be used to create versatile polymorphic validations
 */
export type Vehicle = Car | Truck | Unicycle;

export interface Car {
	// All members must have one property (discriminant) with a constant value that exactly
	// matches their name. The discriminant can be called anything, as long as it's
	// the same for every model in the union.
	type: "Car";
	all_wheel_drive: boolean;
}

export interface Truck {
	type: "Truck";
	wheels: 4 | 6;
}

export interface Unicycle {
	type: "Unicycle";
	color: PrimaryColors;
}

// You can use tags to organize groups of endpoints
@Route("advanced") @Tags("Advanced") export class AdvancedController extends Controller {
	/**
	 * Various literal and alias types can be applied to path and query parameters
	 */
	@Get("{path}") public typedPath(@Path() path: "test" | "other", @Query() query: AliasType) {
		return path;
	}

	/**
	 * Enums can be used as inputs
	 */
	@Post("enums") public enumInput(@Body() input: ModelWithEnums) {
		return {
			response: `${input.literal} ${input.enum}`,
		};
	}

	/**
	 * You can use generics to enforce response standardization
	 */
	@Get("standard") public standardResponse(): ApiRes<{potato: "cool"}> {
		return {
			response_data: {potato: "cool"},
			status_code: 1,
		};
	}

	/**
	 * Discriminators can be fully validated and displayed well in redoc
	 */
	@Post("discriminator") public discriminator(@Body() input: Vehicle) {
		// Typescript handles discriminated unions

		// Checking the discriminant allows safe access to properties
		if (input.type === "Car") {
			// This access is typesafe.
			console.log(input.all_wheel_drive);
		}
	}

	/**
	 * The middleware decorator can be used to add inline middleware to resources
	 */
	@Middleware({
		name: "InlineMiddleware",
		handler: (request, logger, done) => {
			done({
				headers: {},
				statusCode: 333,
				body: "GO AWAY",
			});
		},
	})
	@Get("inline") public inline() {
		// We'll never get here because the middleware forces a return
	}
}
