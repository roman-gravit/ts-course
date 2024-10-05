/// <reference path="base-component.ts" />
/// <reference path="../models/drag-drop.ts" />
/// <reference path="../decorators/autobind.ts" />

namespace App {

	export class ProjectItem extends Component<HTMLUListElement, HTMLLIElement>
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
}