/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	"use strict";
	var GapBuffer = (function () {
	    // constructor
	    function GapBuffer(mx) {
	        if (mx === void 0) { mx = 10; }
	        this._a = new Array(mx);
	        this._len = 0;
	        this._max = mx;
	        this._gap = 0;
	    }
	    Object.defineProperty(GapBuffer.prototype, "length", {
	        get: function () {
	            return this._len;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(GapBuffer.prototype, "capacity", {
	        get: function () {
	            return this._max;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    GapBuffer.prototype.getAt = function (i) {
	        if (i < 0 || i >= this._len)
	            throw "GapBuffer.getAt: illegal index: " + i;
	        return (i < this._gap) ? this._a[i] : this._a[this._max - (this._len - i)];
	    };
	    GapBuffer.prototype.setArrayAt = function (i, a) {
	        if (a === undefined || a.length == 0)
	            return;
	        if (i < 0 || i + a.length > this._len)
	            throw "GapBuffer.setArrayAt: illegal operation: " + i + ", " + a.length;
	        var j = 0;
	        for (; i < this._gap && j < a.length; i++, j++)
	            this._a[i] = a[j];
	        for (i = this.gapEnd(); j < a.length; i++, j++)
	            this._a[i] = a[j];
	    };
	    GapBuffer.prototype.setAt = function (i) {
	        var rest = [];
	        for (var _i = 1; _i < arguments.length; _i++) {
	            rest[_i - 1] = arguments[_i];
	        }
	        this.setArrayAt(i, rest);
	    };
	    GapBuffer.prototype.insertArrayAt = function (i, a) {
	        if (a == null || a.length == 0)
	            return;
	        this.makeMoreRoom(a.length);
	        this.setGap(i);
	        for (var j = 0; j < a.length; j++)
	            this._a[i + j] = a[j];
	        this._gap += a.length;
	        this._len += a.length;
	        return this._len;
	    };
	    GapBuffer.prototype.insertAt = function (i) {
	        var rest = [];
	        for (var _i = 1; _i < arguments.length; _i++) {
	            rest[_i - 1] = arguments[_i];
	        }
	        return this.insertArrayAt(i, rest);
	    };
	    GapBuffer.prototype.reverse = function () {
	        var h = Math.floor(this._len / 2);
	        var s = 0;
	        var e = this._len - 1;
	        for (; s < h; s++, e--) {
	            var t = this.getAt(s);
	            this.setAt(s, this.getAt(e));
	            this.setAt(e, t);
	        }
	    };
	    GapBuffer.prototype.push = function (o) {
	        this.insertAt(this._len, o);
	    };
	    GapBuffer.prototype.pop = function () {
	        return this.deleteAt(this._len - 1);
	    };
	    GapBuffer.prototype.shift = function () {
	        return this.deleteAt(0);
	    };
	    GapBuffer.prototype.unshift = function () {
	        var rest = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            rest[_i - 0] = arguments[_i];
	        }
	        return this.insertArrayAt(0, rest);
	    };
	    GapBuffer.prototype.deleteAt = function (i, n) {
	        if (n === void 0) { n = 1; }
	        if (i < 0 || i + n > this._len)
	            throw "GapBuffer.deleteAt: illegal operation: " + i + ", " + n;
	        var o = this.getAt(i);
	        this.setGap(i);
	        this._len -= n;
	        return o;
	    };
	    GapBuffer.prototype.empty = function () {
	        this._gap = 0;
	        this._len = 0;
	    };
	    GapBuffer.prototype.splice = function (i, nDel) {
	        var rest = [];
	        for (var _i = 2; _i < arguments.length; _i++) {
	            rest[_i - 2] = arguments[_i];
	        }
	        var aRet = [];
	        if (i > this._len)
	            i = this._len;
	        else if (i < 0)
	            i = this._len + i;
	        if (nDel === undefined && rest.length == 0)
	            nDel = this._len - i;
	        for (var j = 0; j < nDel; j++)
	            aRet.push(this.getAt(i + j));
	        this.deleteAt(i, nDel);
	        this.insertArrayAt(i, rest);
	        return aRet;
	    };
	    GapBuffer.prototype.slice = function (b, e) {
	        if (b === undefined)
	            b = 0;
	        else if (b < 0)
	            b = this._len + b;
	        if (e === undefined)
	            e = this._len;
	        else if (e < 0)
	            e = this._len + e;
	        var g = new GapBuffer(e - b);
	        for (; b < e; b++)
	            g.push(this.getAt(b));
	        return g;
	    };
	    GapBuffer.prototype.shrink = function () {
	        this.setGap(this._len);
	        this._a = this._a.slice(0, this._len);
	        this._max = this._len;
	    };
	    GapBuffer.prototype.forEach = function (f, thisArg) {
	        var len = this.length;
	        for (var i = 0; i < len; i++)
	            if (i < this.length)
	                f.call(thisArg, this.getAt(i), i, this);
	    };
	    GapBuffer.prototype.map = function (f, thisArg) {
	        var copy = new GapBuffer(this._len);
	        var i;
	        var j = 0;
	        for (i = 0; i < this._gap; i++, j++)
	            copy._a[j] = f.call(thisArg, this._a[i], j, this);
	        for (i = this.gapEnd(); i < this._max; i++, j++)
	            copy._a[j] = f.call(thisArg, this._a[i], j, this);
	        copy._len = this._len;
	        copy._gap = this._len;
	        return copy;
	    };
	    GapBuffer.prototype.filter = function (f, thisArg) {
	        var result = new GapBuffer();
	        for (var i = 0; i < this._len; i++) {
	            var o = this.getAt(i);
	            if (f.call(thisArg, o, i, this))
	                result.push(o);
	        }
	        return result;
	    };
	    GapBuffer.prototype.fill = function (o) {
	        var i;
	        for (i = 0; i < this._gap; i++)
	            this._a[i] = o;
	        for (i = this.gapEnd(); i < this._max; i++)
	            this._a[i] = o;
	    };
	    GapBuffer.prototype.reserve = function (total) {
	        this.makeTotalRoom(total);
	    };
	    // helpers
	    GapBuffer.prototype.makeMoreRoom = function (incr) {
	        this.makeTotalRoom(this._len + incr);
	    };
	    GapBuffer.prototype.makeTotalRoom = function (total) {
	        if (total < 0)
	            throw "GapBuffer.makeTotalRoom: illegal size request: " + total;
	        if (total <= this._max)
	            return;
	        if (total < this._max * 2 && (total - this._max) < 64000)
	            total = this._max * 2;
	        var newA = new Array(total);
	        for (var i = 0; i < this._gap; i++)
	            newA[i] = this._a[i];
	        var k = this._gap;
	        for (var j = this.gapEnd(); j < this._max; j++)
	            newA[k++] = this._a[j++];
	        this._a = newA;
	        this._max = total;
	        this._gap = this._len;
	    };
	    GapBuffer.prototype.setGap = function (i) {
	        if (i > this._gap) {
	            var b = this._gap;
	            var e = this.gapEnd();
	            for (; b < i; b++, e++)
	                this._a[b] = this._a[e];
	        }
	        else {
	            var b = this._gap - 1;
	            var e = this.gapEnd() - 1;
	            for (; b >= i; b--, e--)
	                this._a[e] = this._a[b];
	        }
	        this._gap = i;
	    };
	    GapBuffer.prototype.gapEnd = function () {
	        return this._max - (this._len - this._gap);
	    };
	    return GapBuffer;
	}());
	exports.GapBuffer = GapBuffer;
	;


/***/ }
/******/ ]);
//# sourceMappingURL=gap.js.map