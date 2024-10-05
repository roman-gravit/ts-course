export { ProjectInput };

import { Component } from "../components/base-component.js";
import { autoBind } from "../decorators/autobind.js";
import { projectState } from "../state/project-state.js";
import { isNumberValueValid, isStringValueValid, ValidatableNumber, ValidatableString } from "../utils/validation.js";

class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
	titleInputElement: HTMLInputElement;
	descriptionInputElement: HTMLInputElement;
	peopleInputElement: HTMLInputElement;

	constructor() {
		super("project-input", "app", "afterbegin", "user-input");		
		this.titleInputElement = this.element.querySelector("#title") as HTMLInputElement;
		this.descriptionInputElement = this.element.querySelector("#description") as HTMLInputElement;
		this.peopleInputElement = this.element.querySelector("#people") as HTMLInputElement;
		this.configure();
	}

	configure() {	
		this.element.addEventListener("submit", this.submitFormEventHandler);
	}

	@autoBind
	private submitFormEventHandler(event: SubmitEvent) {
		console.log(`Input value: ${this.titleInputElement.value}`);
		event.preventDefault();
		const userInput = this.getUserInputValues();
		if(Array.isArray(userInput)) {
			const [title, description, amount] = userInput;
			projectState.addProject(title, description, amount);
			this.clearInputValues();
		}
	}

	private getUserInputValues(): [string, string, number] | void {
		const title = this.titleInputElement.value;
		const description = this.descriptionInputElement.value;
		const peopleAmount = this.peopleInputElement.value;

		const titleValidateable: ValidatableString = {
			value: title, required: true
		}

		const descriptionValidateable: ValidatableString = {
			value: description, required: true, minLength: 5
		}

		const amountValidateable: ValidatableNumber = {
			value: peopleAmount, required: true, min: 1, max: 5
		}

		try {
			this.throwIfStringValidateFailed(titleValidateable);
			this.throwIfStringValidateFailed(descriptionValidateable);
			this.throwIfNumberValidateFailed(amountValidateable);

		} catch(e: unknown) {
			alert((e as Error).message);
			return;
		}

		return [title, description, +peopleAmount];
	}

	private throwIfStringValidateFailed(value: ValidatableString): void {
		if(!isStringValueValid(value)) {
			throw Error("Invalid string value, try again");
		}
	}

	private throwIfNumberValidateFailed(value: ValidatableNumber): void {
		if(!isNumberValueValid(value)) {
			throw Error("Invalid number value, try again");
		}
	}

	private clearInputValues() {
		this.peopleInputElement.value = "";
		this.titleInputElement.value = "";
		this.descriptionInputElement.value = "";
		
	}
}