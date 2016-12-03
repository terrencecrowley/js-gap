import * as GB from "./lib/gap";

let hrstart = process.hrtime();
let hrend = process.hrtime(hrstart);

function assert(bTest: boolean, sMsg: string)
{
	if (! bTest)
		console.info("%s: fail", sMsg);
}

function CompareSplice(g: GB.GapBuffer<any>, a: Array<any>): void
{
	let len: number = a.length;
	let i: number;
	let o = { };

	let hrstart = process.hrtime();
	for (i = 0; i < len; i++)
	{
		g.deleteAt(i);
		g.insertAt(i, o);
	}
	let hrend = process.hrtime(hrstart);
	console.info("  GAP: %ds %dms (Length %d)", hrend[0], hrend[1]/1000000, len);
	hrstart = process.hrtime();
	for (i = 0; i < len; i++)
	{
		a.splice(i, 1);
		a.splice(i, 0, o);
	}
	hrend = process.hrtime(hrstart);
	console.info("ARRAY: %ds %dms (Length %d)", hrend[0], hrend[1]/1000000, len);

}


function FillForCompare(len: number, g: GB.GapBuffer<any>, a: Array<any>): void
{
	let o = { };
	for (let i = 0; i < len; i++)
	{
		g.insertAt(i, o);
		a[i] = o;
	}
}


function TestForPerformance(): void
{
	let g: GB.GapBuffer<any>;
	let a: Array<any>;
	let tests = [ 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 10000, 100000 ];

	for (let j = 0; j < tests.length; j++)
	{
		g = new GB.GapBuffer<any>(tests[j]);
		a = new Array(tests[j]);
		FillForCompare(tests[j], g, a);
		CompareSplice(g, a);
	}
}

function ValidateTotal(testname: string, a: GapNumber, expected_total: number): void
{
	let total: number = 0;
	a.forEach(function (n: number) { total += n; });
	if (expected_total != total)
		console.info("%s: ValidateTotal: %d expected, %d seen", testname, expected_total, total);
}

type GapNumber = GB.GapBuffer<number>;

function RunApis(): void
{
	// Construction
		// empty
		let a1: GB.GapBuffer<number> = new GB.GapBuffer<number>();
		assert(a1.length == 0, "Empty buffer length should be zero");
		// explicitly sized
		let a2: GB.GapBuffer<number> = new GB.GapBuffer<number>(10);
		assert(a2.length == 0, "Sized buffer length should be zero");

	// push
		// Normal push
		a1.push(0);
		// Push from element in array
		a1.push(a1.getAt(0));

	// insert
		a1.empty();
		a1.insertAt(0, 1);
		ValidateTotal("insertAt", a1, 1);
	// insert with additional args
		a1.insertAt(0, 1, 2, 3);
		ValidateTotal("insertAt with multiple", a1, 7);

	// reserve
		a1.reserve(100);
		assert(a1.capacity == 100, "Sized buffer capacity should be 100");

	// erase
		// erase one element
		a1.deleteAt(0);
		ValidateTotal("deleteAt", a1, 6);
		// erase range
		a1.deleteAt(0, a1.length);
		ValidateTotal("deleteAt with argument", a1, 0);

	// fill
		a1.insertAt(0, 1, 2, 3);
		ValidateTotal("insertAt for fill", a1, 6);
		a1.fill(3);
		ValidateTotal("fill", a1, 9);

	// insert

	// clear
		a1.empty();
		ValidateTotal("empty", a1, 0);

	// filter
		a1.insertAt(0, 1, 2, 3);
		let x: GB.GapBuffer<number> = a1.filter(function(v: number) { return v > 1; });
		assert(x.length == 2, "Filter should return 2 elements");

	// map
		x = a1.map(function(v: number) { return v * 2; });
		ValidateTotal("map", x, 12);

	// forEach
		let t: number = 0;
		a1.forEach(function(v: number) { t += v; });
		assert(t == 6, "forEach should see each element");

	// shrink/reserve
		a1.reserve(100);
		assert(a1.capacity == 100, "reserve should set capacity");
		a1.shrink();
		assert(a1.capacity == 3 && a1.capacity == a1.length, "shrink should reduce capacity to length");

	// slice
		a2 = a1.slice();
		ValidateTotal("slice, no args", a2, 6);
		a2 = a1.slice(1);
		ValidateTotal("slice, one args", a2, 5);
		a2 = a1.slice(2, 3);
		ValidateTotal("slice, two args", a2, 3);

	// splice
		a1.splice(2, 1);
		ValidateTotal("splice, just delete", a1, 3);
		a1.push(3);
		a1.splice(2, 0, 4);
		ValidateTotal("splice, just insert", a1, 10);
		a1.splice(1, 1, 5);
		ValidateTotal("splice, delete and insert", a1, 13);

	// reverse
		a1.empty();
		a1.insertAt(0, 1, 2, 3);
		a1.reverse();
		assert(a1.getAt(0) == 3 && a1.getAt(2) == 1, "reverse");

	// push
	// pop
}

function AllTests(): void
{
	RunApis();
	TestForPerformance();
}

AllTests();
