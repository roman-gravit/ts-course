import { add } from "./basics.js";
import { of, Observable, from } from "rxjs";

console.log(`result   add: ${add(2, 3)}`);



const emitter : Observable<number> = of(1, 2, 3, 4);
emitter.subscribe((value: number) => {
	console.log(`of value: ${value}`)
});


const emitArray : Observable<number> = from([1, 2, 3, 4]);
emitArray.subscribe((value: number) => {
	console.log(`from arr: ${value}`);
});