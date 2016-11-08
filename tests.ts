import * as GB from "./src/gap";

let hrstart = process.hrtime();
let hrend = process.hrtime(hrstart);

function CompareSplice(g: GB.GapBuffer, a: Array<any>)
{
	let len: number = a.length;
	let i: number;
	let o = { };

	let hrstart = process.hrtime();
	for (i = 0; i < len; i++)
	{
		a.splice(i, 1);
		a.splice(i, 0, o);
	}
	let hrend = process.hrtime(hrstart);
	console.info("Length: %d Array execution time (hr): %ds %dms", len, hrend[0], hrend[1]/1000000);

	hrstart = process.hrtime();
	for (i = 0; i < len; i++)
	{
		g.deleteAt(i);
		g.insertAt(i, o);
	}
	hrend = process.hrtime(hrstart);
	console.info("Length: %d Gap execution time (hr): %ds %dms", len, hrend[0], hrend[1]/1000000);
}


function FillForCompare(len: number, g: GB.GapBuffer, a: Array<any>)
{
	g.empty();
	a.splice(0, a.length);

	let o = { };
	for (let i = 0; i < len; i++)
	{
		g.insertAt(i, o);
		a[i] = o;
	}
}


let g: GB.GapBuffer = new GB.GapBuffer();
let a: Array<any> = [];
let tests = [ 100, 1000, 10000, 100000 ];

for (let j = 0; j < tests.length; j++)
{
	FillForCompare(tests[j], g, a);
	CompareSplice(g, a);
}
