namespace App {
	console.log("validation.ts ->");

	// Validate 
	interface IsRequired {
		value: string;
		required?: boolean;
	}
	
	export interface ValidatableString extends IsRequired {
		minLength?: number;
		maxLength?: number;
	}

	export interface ValidatableNumber extends IsRequired {
		min?: number;
		max?: number;
	}
	
	export function isStringValueValid(input: ValidatableString): boolean {
		input.value = input.value.trim();
		return  _isRequiredCheckPassed(input) 
				&& _isMinLengthCheckPassed(input)
				&& _isMaxLengthCheckPassed(input);
	
		//
		function _isRequiredCheckPassed(input: ValidatableString): boolean {
			if(!input.required) {
				return true;
			}
			return input.value.length !== 0;
		}
	
		function _isMinLengthCheckPassed(input: ValidatableString): boolean {
			if(input.minLength === undefined) {
				return true;
			}
			return input.value.length > input.minLength;
		}
	
		function _isMaxLengthCheckPassed(input: ValidatableString): boolean {
			if(input.maxLength === undefined) {
				return true;
			}
			return input.value.length < input.maxLength;
		}
	}
	
	export function isNumberValueValid(input: ValidatableNumber): boolean {
		const value = +input.value.trim();
		return _isRequiredCheckPassed(input)
				&& _isMinValueCheckPassed(input, value)
				&& _isNaxValueCheckPassed(input, value);
	
		//
		function _isRequiredCheckPassed(input: ValidatableNumber): boolean {
			if(!input.required) {
				return true;
			}
			return input.value.toString().length !== 0;
		}
	
		function _isMinValueCheckPassed(input: ValidatableNumber, value: number): boolean {
			if(input.min===undefined) {
				return true;
			}
			return value >= input.min;
		}
	
		function _isNaxValueCheckPassed(input: ValidatableNumber, value: number): boolean {
			if(input.max===undefined) {
				return true;
			}
			return value < input.max;
		}
	}

}