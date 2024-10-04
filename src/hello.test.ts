class MyCallbackClass {
	
	executeCallback(value: string, 
		            callbackFn: (value: string) => null
					): number 
	{
		console.log(`100`);
		callbackFn(value);
		return 10;
	}
}

it("should mock callback function", () => {
	
	let mock = jest.fn();
	let myCallbackClass = new MyCallbackClass();
	myCallbackClass.executeCallback('test', mock);

	expect(mock).toHaveBeenCalled();
	expect(myCallbackClass.executeCallback('test', mock)).toBe(10);

	const logSpy = jest.spyOn(console, 'log');
	myCallbackClass.executeCallback('test', mock);
	expect(logSpy).toHaveBeenCalled();
});

it("console.log should be called", () => {
	
	let mock = jest.fn();
	let myCallbackClass = new MyCallbackClass();

	const logSpy = jest.spyOn(console, 'log');
	myCallbackClass.executeCallback('test', mock);
	expect(logSpy).toHaveBeenCalledWith('100');

});

describe("a group of tests", () => {
	
	it("1. should throw an error", () => {
		expect( () => { throwsError() } ).toThrow(new Error("this is an error"));
	});
	
	it("2. second test", () => {
		expect("abc").not.toEqual("def");
	})
});


function throwsError() {
	throw new Error("this is an error");
}