export type ForEachFunction = (v: any, i?: number, buf?: any) => void;
export type MapFunction = (v: any, i?: number, buf?: any) => any;
export type FilterFunction = (v: any, i?: number, buf?: any) => boolean;

export class GapBuffer<ValueType>
{
	private _a: Array<ValueType>;
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

	get capacity(): number
		{
			return this._max;
		}

	getAt(i: number): ValueType
		{
			if (i < 0 || i >= this._len) throw "GapBuffer.getAt: illegal index: " + i;
			return (i < this._gap) ? this._a[i] : this._a[this._max - (this._len - i)];
		}
	
	setArrayAt(i: number, a: Array<ValueType>): void
		{
			if (a === undefined || a.length == 0) return;
			if (i < 0 || i+a.length > this._len) throw "GapBuffer.setArrayAt: illegal operation: " + i + ", " + a.length;
			let j: number = 0;
			for (; i < this._gap && j < a.length; i++, j++)
				this._a[i] = a[j];
			for (i = this.gapEnd(); j < a.length; i++, j++)
				this._a[i] = a[j];
		}

	setAt(i: number, ...rest: Array<ValueType>): void
		{
			this.setArrayAt(i, rest);
		}

	insertArrayAt(i: number, a: Array<ValueType>): number
		{
			if (a == null || a.length == 0) return;
			this.makeMoreRoom(a.length);
			this.setGap(i);
			for (let j: number = 0; j < a.length; j++)
				this._a[i+j] = a[j];
			this._gap += a.length;
			this._len += a.length;
			return this._len;
		}

	insertAt(i: number, ...rest: Array<ValueType>): number
		{
			return this.insertArrayAt(i, rest);
		}

	reverse(): void
		{
			let h: number = Math.floor(this._len / 2);
			let s: number = 0;
			let e: number = this._len - 1;
			for (; s < h; s++, e--)
			{
				let t: ValueType = this.getAt(s);
				this.setAt(s, this.getAt(e));
				this.setAt(e, t);
			}
		}

	push(o: ValueType): void
		{
			this.insertAt(this._len, o);
		}

	pop(): ValueType
		{
			return this.deleteAt(this._len - 1);
		}

	shift(): ValueType
		{
			return this.deleteAt(0);
		}

	unshift(...rest: Array<ValueType>): number
		{
			return this.insertArrayAt(0, rest);
		}

	deleteAt(i: number, n: number = 1): ValueType
		{
			if (i < 0 || i+n > this._len) throw "GapBuffer.deleteAt: illegal operation: " + i + ", " + n;
			let o: ValueType = this.getAt(i);
			this.setGap(i);
			this._len -= n;
			return o;
		}

	empty()
		{
			this._gap = 0;
			this._len = 0;
		}

	splice(i: number, nDel?: number, ...rest: Array<ValueType>): Array<ValueType>
		{
			let aRet: Array<ValueType> = [];

			if (i > this._len) i = this._len;
			else if (i < 0) i = this._len + i;
			if (nDel === undefined && rest.length == 0) nDel = this._len - i;
			for (let j = 0; j < nDel; j++)
				aRet.push(this.getAt(i+j));
			this.deleteAt(i, nDel);
			this.insertArrayAt(i, rest);
			return aRet;
		}

	slice(b?: number, e?: number): GapBuffer<ValueType>
		{
			if (b === undefined) b = 0;
			else if (b < 0) b = this._len + b;
			if (e === undefined) e = this._len;
			else if (e < 0) e = this._len + e;
			let g = new GapBuffer<ValueType>(e - b);
			for (; b < e; b++)
				g.push(this.getAt(b));
			return g;
		}

	shrink(): void
		{
			this.setGap(this._len);
			this._a = this._a.slice(0, this._len);
			this._max = this._len;
		}

	forEach(f: ForEachFunction, thisArg?: any): void
		{
			let len: number = this.length;
			for (let i: number = 0; i < len; i++)
				if (i < this.length)	// may have been modifications
					f.call(thisArg, this.getAt(i), i, this);
		}

	map(f: MapFunction, thisArg?: any): GapBuffer<ValueType>
		{
			let copy: GapBuffer<ValueType> = new GapBuffer<ValueType>(this._len);
			let i: number;
			let j: number = 0;
			for (i = 0; i < this._gap; i++, j++)
				copy._a[j] = f.call(thisArg, this._a[i], j, this);
			for (i = this.gapEnd(); i < this._max; i++, j++)
				copy._a[j] = f.call(thisArg, this._a[i], j, this);
			copy._len = this._len;
			copy._gap = this._len;
			return copy;
		}

	filter(f: FilterFunction, thisArg?: any): GapBuffer<ValueType>
		{
			let result: GapBuffer<ValueType> = new GapBuffer<ValueType>();
			for (let i: number = 0; i < this._len; i++)
			{
				let o: ValueType = this.getAt(i);
				if (f.call(thisArg, o, i, this))
					result.push(o);
			}
			return result;
		}

	fill(o: ValueType): void
		{
			let i: number;
			for (i = 0; i < this._gap; i++)
				this._a[i] = o;
			for (i = this.gapEnd(); i < this._max; i++)
				this._a[i] = o;
		}

	reserve(total: number): void
		{
			this.makeTotalRoom(total);
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
