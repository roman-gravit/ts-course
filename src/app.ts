/// <reference path="./models/drag-drop.ts" />
/// <reference path="./models/project.ts" />
/// <reference path="./state/project-state.ts" />
/// <reference path="./utils/validation.ts" />
/// <reference path="./decorators/autobind.ts" />
/// <reference path="./components/base-component.ts" />
/// <reference path="./components/project-list.ts" />
/// <reference path="./components/project-input.ts" />

namespace App {

	console.log("app->");

	new ProjectInput();
	new ProjectList(ProjectType.active);
	new ProjectList(ProjectType.finished);
	
	console.log("app<-");
}
