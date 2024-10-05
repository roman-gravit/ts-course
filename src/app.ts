console.log("app->");

// Drag & Drop
interface Draggable {
	dragStartHandler(event: DragEvent): void;
	dragEndHandler(event: DragEvent): void;
}

interface DragTarget {
	dragOverHandler(event: DragEvent): void;
	dragLeaveHandler(event: DragEvent): void;
	dropHandler(event: DragEvent): void;
}


enum ProjectType  {
	"active" = "active",
	"finished" = "finished"
};
class Project {
	title: string;
	description: string;
	id: string;
	persons: number;
	status: ProjectType

	constructor(title: string, description: string, 
				persons: number) 
	{
		this.title = title;
		this.description = description;
		this.id = Math.floor(Math.random() * 10000).toString();
		this.persons = persons;
		this.status = ProjectType.active;
	}
}

type Listener<T> = (projects: T[]) => void;

class State<T> {
	protected listeners: Listener<T>[] = [];

	addListener(listener: Listener<T>) {
		this.listeners.push(listener);
	}
}
class ProjectState extends State<Project> {
	private static instance: ProjectState;
	private projects: Project[] = [];

	private constructor () {
		super();
	}

	addProject(title: string, description: string, numberOfPersons: number) {
		this.projects.push(
			new Project(title, description, numberOfPersons));
		this.notifyListeners();
	}

	moveProject(id: string | undefined, newStatus: ProjectType) {
		const project = this.projects.find(item => item.id === id);
		if(project && project.status !== newStatus) {
			project.status = newStatus;
			this.notifyListeners();
		}
	}

	private notifyListeners() {
		for(const listener of this.listeners) {
			listener([...this.projects]);
		}
	}

	static getInstance(): ProjectState {
		if(!this.instance) {
			this.instance = new ProjectState();
		}
		return this.instance;
	}
}

const projectState = ProjectState.getInstance();

// Validate 
interface IsRequired {
	value: string;
	required?: boolean;
}
interface ValidatableString extends IsRequired {
	minLength?: number;
	maxLength?: number;
}
interface ValidatableNumber extends IsRequired {
	min?: number;
	max?: number;
}

function isStringValueValid(input: ValidatableString): boolean {
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

function isNumberValueValid(input: ValidatableNumber): boolean {
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

//autobind decorator
function autoBind(_target: any, 
				  _methdoName: string, 
				  descriptor: PropertyDescriptor
				  ) 
{
	//console.log("autoBind->");
	const originalMethod = descriptor.value;
	const adjDesciptor: PropertyDescriptor = {
		configurable: true,
		get() {
			const boundFn =originalMethod.bind(this);
			return boundFn;
		}
	};
	return adjDesciptor;
}

abstract class Component<THost extends HTMLElement, TElement extends HTMLElement> {
	templateElement: HTMLTemplateElement;
	hostElement: THost;
	element: TElement;

	constructor(templateId: string, hostId: string, 
				insertPosition: InsertPosition,
		        newElementId?: string) 
	{
		this.hostElement = document.getElementById(hostId)! as THost;
		this.templateElement = 
			document.getElementById(templateId)! as HTMLTemplateElement;		

		const templateContentFragment = document.importNode(this.templateElement.content, true);
		this.element = templateContentFragment.firstElementChild as TElement;
		if(newElementId) {
			this.element.id = newElementId;
		}

		this.insertElementToHostDiv(insertPosition);
	}

	private insertElementToHostDiv(insertPosition: InsertPosition) {
		this.hostElement.insertAdjacentElement(insertPosition, this.element);
	}

	abstract configure(): void;
} 

class ProjectItem extends Component<HTMLUListElement, HTMLLIElement>
				  implements Draggable 
{
	private project: Project;

	get persons() {
		return this.project.persons === 1 
			? "1 person"
			: `${this.project.persons} persons`;
	}

	constructor(hostId: string, project: Project) {
		super("single-project", hostId, "beforeend", project.id);
		this.project = project;

		this.configure();
		this.renderContent();
	}

	@autoBind
	dragStartHandler(event: DragEvent): void {
		event.dataTransfer!.setData("text/plain", this.project.id);
		event.dataTransfer!.effectAllowed = "move";
	}

	@autoBind
	dragEndHandler(_event: DragEvent): void {
		console.log("dragEndHandler");
	}

	configure(): void {
		this.element.addEventListener("dragstart", this.dragStartHandler);
		this.element.addEventListener("dragstart", this.dragEndHandler);
	}

	renderContent() {
		this.element.querySelector("h2")!.textContent = this.project.title;
		this.element.querySelector("h3")!.textContent = this.persons + ' assigned'; 
		this.element.querySelector("p")!.textContent = this.project.description;
	}
}
class ProjectList extends Component<HTMLDivElement, HTMLElement> 
				  implements DragTarget 
{
	assignedProjects: Project[] = [];
	listType: ProjectType;

	constructor(type: ProjectType) {
		super("project-list", "app", "beforeend", `${type}-projects`);
		this.listType = type;
		this.configure();
		this.renderContent();
	}

	configure() {
		this.element.addEventListener("dragover", this.dragOverHandler);
		this.element.addEventListener("drop", this.dropHandler);
		this.element.addEventListener("dragleave", this.dragLeaveHandler);
		projectState.addListener(this.changeProjectStateListener);
	}

	@autoBind
	dragOverHandler(event: DragEvent): void {
		if(event.dataTransfer?.types[0] === "text/plain") {
			event.preventDefault();
			const list = this.element.querySelector("ul")!;
			list.classList.add("droppable");
		}
	}

	@autoBind
	dragLeaveHandler(_event: DragEvent): void {
		const list = this.element.querySelector("ul")!;
		list.classList.remove("droppable");
	}

	@autoBind
	dropHandler(event: DragEvent): void {
		const projectID = event.dataTransfer?.getData("text/plain");
		projectState.moveProject(projectID, 
								 this.listType === ProjectType.active
								     ? ProjectType.active
									 : ProjectType.finished);
	}
	
	@autoBind
	private changeProjectStateListener(projects: Project[]) {
		this.assignedProjects = projects.filter(item => {
			return this.listType === ProjectType.active
				? item.status === ProjectType.active
				: item.status === ProjectType.finished;			
		});
		this.renderProjects();
	}
	
	private renderContent() {
		const listId = `${this.listType}-projects-list`;
		this.element.querySelector("ul")!.id = listId;
		this.element.querySelector("h2")!.textContent = `${this.listType} PROJECTS`;
	}

	private renderProjects() {
		const list = document.getElementById(
			`${this.listType}-projects-list`)! as HTMLUListElement;
		
		list.innerHTML = "";
		for(const item of this.assignedProjects) {
			new ProjectItem(this.element.querySelector("ul")!.id, item);
		}
	}
}

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

const projectInput = new ProjectInput();
const activeProjectList = new ProjectList(ProjectType.active);
const finishedProjectList = new ProjectList(ProjectType.finished);

console.log("app<-");