import { ProjectInput } from "./components/project-input.js";
import { ProjectList } from "./components/project-list.js";
import { ProjectType } from "./models/project.js";

console.log("app->");

new ProjectInput();
new ProjectList(ProjectType.active);
new ProjectList(ProjectType.finished);
	
console.log("app<-");

