namespace App {
	export abstract class Component<THost extends HTMLElement, TElement extends HTMLElement> {
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
	
}