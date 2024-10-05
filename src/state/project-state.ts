/// <reference path="../models/project.ts" />

namespace App {

	console.log("project-state->");

	type Listener<T> = (projects: T[]) => void;

	class State<T> {
		protected listeners: Listener<T>[] = [];
	
		addListener(listener: Listener<T>) {
			this.listeners.push(listener);
		}
	}
	
	export class ProjectState extends State<Project> {
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

	export const projectState = ProjectState.getInstance();	
}