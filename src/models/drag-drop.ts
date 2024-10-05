export { Draggable, DragTarget };

console.log("drag-drop->");
 interface Draggable {
	dragStartHandler(event: DragEvent): void;
	dragEndHandler(event: DragEvent): void;
}

interface DragTarget {
	dragOverHandler(event: DragEvent): void;
	dragLeaveHandler(event: DragEvent): void;
	dropHandler(event: DragEvent): void;
}