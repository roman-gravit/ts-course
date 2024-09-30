
//8
{

	function add(num1: number, num2: number, cb: (param: number) => number) {
		const result = num1 + num2;
		const callback_res = cb(result);
		console.log(`callback_res: ${callback_res} typeof: ${typeof callback_res}`)
	}
	
	add(20, 11, (result: number): number => {
		let vb = result ?? "10"; 
		console.log(`result: ${result} vb: ${vb}`);
		return 10;
	})
}

window.addEventListener("load", function() {
	const button = document.getElementById("btn");
	button?.addEventListener("click", buttonOnClick);
})

function buttonOnClick(this: HTMLElement, _ev: MouseEvent) {
	console.log(`buttonOnClick: this ${this}`);
}
