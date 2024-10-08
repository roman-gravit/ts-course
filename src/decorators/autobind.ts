export { autoBind };

console.log("decorator.ts ->");

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