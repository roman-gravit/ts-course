import { ProjectInput } from "./components/project-input";
import { ProjectList } from "./components/project-list";
import { ProjectType } from "./models/project";

import "../style.css";

console.log("app1 ->");

new ProjectInput();
new ProjectList(ProjectType.active);
new ProjectList(ProjectType.finished);
	
console.log("app<-");

