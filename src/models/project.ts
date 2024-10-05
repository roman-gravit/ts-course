export { ProjectType, Project };

console.log("project-model->");

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