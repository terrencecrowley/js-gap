export class GapBuffer
{
	private _a: Array<any>;
	private _len: number;
	private _max: number;
	private _gap: number;

	// constructor
	constructor(mx: number = 10)
		{
			this._a = new Array(mx);
			this._len = 0;
			this._max = mx;
			this._gap = 0;
		}

	get length(): number
		{
			return this._len;
		}

	get max(): number
		{
			return this._max;
		}

	getAt(i: number): any
		{
			if (i < 0 || i >= this._len) throw "GapBuffer.getAt: illegal index: " + i;
			return (i < this._gap) ? this._a[i] : this._a[this._max - (this._len - i)];
		}
	
	setAt(i: number, o: any): void
		{
			if (i < 0 || i >= this._len) throw "GapBuffer.setAt: illegal index: " + i;
			if (i < this._gap) this._a[i] = o; else this._a[this._max - (this._len - i)] = 0;
		}

	setArrayAt(i: number, a: Array<any>): void
		{
			if (a === undefined || a.length == 0) return;
			if (i < 0 || i+a.length >= this._len) throw "GapBuffer.setArrayAt: illegal operation: " + i + ", " + a.length;
			let j: number = 0;
			for (; i < this._gap && j < a.length; i++, j++)
				this._a[i] = a[j];
			for (i = this.gapEnd(); j < a.length; i++, j++)
				this._a[i] = a[j];
		}

	insertAt(i: number, o: any): void
		{
			this.makeMoreRoom(1);
			this.setGap(i);
			this._a[this._gap++] = o;
			this._len++;
		}

	insertArrayAt(i: number, a: Array<any>): void
		{
			if (a === undefined || a.length == 0) return;
			this.makeMoreRoom(a.length);
			this.setGap(i);
			for (let j: number = 0; j < a.length; j++)
				this._a[i+j] = a[j];
			this._gap += a.length;
			this._len += a.length;
		}

	push(o: any): void
		{
			this.insertAt(this._len, o);
		}

	deleteAt(i: number, n: number = 1)
		{
			if (i < 0 || i+n > this._len) throw "GapBuffer.deleteAt: illegal operation: " + i + ", " + n;
			this.setGap(i);
			this._len -= n;
		}

	empty()
		{
			this._gap = 0;
			this._len = 0;
		}

	splice(i: number, nDel?: number, ...rest: Array<any>): Array<any>
		{
			let aRet: Array<any> = [];

			if (i > this._len) i = this._len;
			else if (i < 0) i = this._len + i;
			if (nDel === undefined && rest.length == 0) nDel = this._len - i;
			for (let j = 0; j < nDel; j++)
				aRet.push(this.getAt(i+j));
			this.deleteAt(i, nDel);
			for (let j = 0; j < rest.length; j++)
				this.insertAt(i+j, rest[j]);
			return aRet;
		}

	slice(b?: number, e?: number)
		{
			if (b === undefined) b = 0;
			else if (b < 0) b = this._len + b;
			if (e === undefined) e = this._len;
			else if (e < 0) e = this._len + e;
			let g = new GapBuffer(e - b);
			for (; b < e; b++)
				g.push(this.getAt(b));
			return g;
		}

	shrink()
		{
			this.setGap(this._len);
			this._a = this._a.slice(0, this._len);
			this._max = this._len;
		}

	forEach(f: () => void, thisArg?: any)
		{
			// f(thisArg, getAt(i), i, this);
		}

	// helpers
	private makeMoreRoom(incr: number): void
		{
			this.makeTotalRoom(this._len + incr);
		}

	private makeTotalRoom(total: number): void
		{
			if (total < 0) throw "GapBuffer.makeTotalRoom: illegal size request: " + total;
			if (total <= this._max) return;
			if (total < this._max * 2 && (total - this._max) < 64000)
				total = this._max * 2;
			let newA = new Array(total);
			for (let i: number = 0; i < this._gap; i++)
				newA[i] = this._a[i];
			let k: number = this._gap;
			for (let j: number = this.gapEnd(); j < this._max; j++)
				newA[k++] = this._a[j++];
			this._a = newA;
			this._max = total;
			this._gap = this._len;
		}

	private setGap(i: number): void
		{
			if (i > this._gap)
			{
				let b: number = this._gap;
				let e: number = this.gapEnd();
				for (; b < i; b++, e++)
					this._a[b] = this._a[e];
			}
			else
			{
				let b: number = this._gap - 1;
				let e: number = this.gapEnd() - 1;
				for (; b >= i; b--, e--)
					this._a[e] = this._a[b];
			}
			this._gap = i;
		}

	private gapEnd(): number
		{
			return this._max - (this._len - this._gap);
		}
};
