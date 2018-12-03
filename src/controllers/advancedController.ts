import {Controller, Get, Route, Path, Query, Post, Body, Tags} from "valory-runtime";

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
}
