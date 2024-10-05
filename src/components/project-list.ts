export { ProjectList };

import { ProjectItem } from "./project-item.js";

import { DragTarget } from "../models/drag-drop.js";
import { Project, ProjectType } from "../models/project.js";
import { Component } from "../components/base-component.js";
import { projectState } from "../state/project-state.js";
import { autoBind } from "../decorators/autobind.js";


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