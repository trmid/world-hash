/*
	NBT.js - a JavaScript parser for NBT archives
	by Sijmen Mulder

	I, the copyright holder of this work, hereby release it into the public
	domain. This applies worldwide.

	In case this is not legally possible: I grant anyone the right to use this
	work for any purpose, without any conditions, unless such conditions are
	required by law.
*/

import * as zlib from 'zlib';


if (typeof ArrayBuffer === 'undefined') {
	throw new Error('Missing required type ArrayBuffer');
}
if (typeof DataView === 'undefined') {
	throw new Error('Missing required type DataView');
}
if (typeof Uint8Array === 'undefined') {
	throw new Error('Missing required type Uint8Array');
}

/**
 * A mapping from type names to NBT type numbers.
 * {@link module:nbt.Writer} and {@link module:nbt.Reader}
 * have correspoding methods (e.g. {@link module:nbt.Writer#int})
 * for every type.
 *
 * @type Object<string, number>
 * @see module:nbt.tagTypeNames */
export const tagTypes = {
	'end': 0,
	'byte': 1,
	'short': 2,
	'int': 3,
	'long': 4,
	'float': 5,
	'double': 6,
	'byteArray': 7,
	'string': 8,
	'list': 9,
	'compound': 10,
	'intArray': 11,
	'longArray': 12
};

/**
 * A mapping from NBT type numbers to type names.
 *
 * @type Object<number, string>
 * @see module:tagTypes */
export const tagTypeNames: Record<number, string> = {};
(() => {
	for (var typeName in tagTypes) {
		if (tagTypes.hasOwnProperty(typeName)) {
			tagTypeNames[(<any>tagTypes)[typeName]] = typeName;
		}
	}
})();

function hasGzipHeader(data: any) {
	var head = new Uint8Array(data.slice(0, 2));
	return head.length === 2 && head[0] === 0x1f && head[1] === 0x8b;
}

function encodeUTF8(str: any) {
	var array = [], i, c;
	for (i = 0; i < str.length; i++) {
		c = str.charCodeAt(i);
		if (c < 0x80) {
			array.push(c);
		} else if (c < 0x800) {
			array.push(0xC0 | c >> 6);
			array.push(0x80 | c         & 0x3F);
		} else if (c < 0x10000) {
			array.push(0xE0 |  c >> 12);
			array.push(0x80 | (c >>  6) & 0x3F);
			array.push(0x80 |  c        & 0x3F);
		} else {
			array.push(0xF0 | (c >> 18) & 0x07);
			array.push(0x80 | (c >> 12) & 0x3F);
			array.push(0x80 | (c >>  6) & 0x3F);
			array.push(0x80 |  c        & 0x3F);
		}
	}
	return array;
}

function decodeUTF8(array: any) {
	var codepoints = [], i;
	for (i = 0; i < array.length; i++) {
		if ((array[i] & 0x80) === 0) {
			codepoints.push(array[i] & 0x7F);
		} else if (i+1 < array.length &&
					(array[i]   & 0xE0) === 0xC0 &&
					(array[i+1] & 0xC0) === 0x80) {
			codepoints.push(
				((array[i]   & 0x1F) << 6) |
				( array[i+1] & 0x3F));
		} else if (i+2 < array.length &&
					(array[i]   & 0xF0) === 0xE0 &&
					(array[i+1] & 0xC0) === 0x80 &&
					(array[i+2] & 0xC0) === 0x80) {
			codepoints.push(
				((array[i]   & 0x0F) << 12) |
				((array[i+1] & 0x3F) <<  6) |
				( array[i+2] & 0x3F));
		} else if (i+3 < array.length &&
					(array[i]   & 0xF8) === 0xF0 &&
					(array[i+1] & 0xC0) === 0x80 &&
					(array[i+2] & 0xC0) === 0x80 &&
					(array[i+3] & 0xC0) === 0x80) {
			codepoints.push(
				((array[i]   & 0x07) << 18) |
				((array[i+1] & 0x3F) << 12) |
				((array[i+2] & 0x3F) <<  6) |
				( array[i+3] & 0x3F));
		}
	}
	return String.fromCharCode.apply(null, codepoints);
}

/* Not all environments, in particular PhantomJS, supply
		Uint8Array.slice() */
function sliceUint8Array(array: any, begin: any, end: any) {
	if ('slice' in array) {
		return array.slice(begin, end);
	} else {
		return new Uint8Array([].slice.call(array, begin, end));
	}
}

/**
 * In addition to the named writing methods documented below,
 * the same methods are indexed by the NBT type number as well,
 * as shown in the example below.
 *
 * @constructor
 * @see module:nbt.Reader
 *
 * @example
 * var writer = new nbt.Writer();
 *
 * // all equivalent
 * writer.int(42);
 * writer[3](42);
 * writer(tagTypes.int)(42);
 *
 * // overwrite the second int
 * writer.offset = 0;
 * writer.int(999);
 *
 * return writer.buffer; */
export class Writer {

	/* Will be resized (x2) on write if necessary. */
	private buffer = new ArrayBuffer(1024);

	/* These are recreated when the buffer is */
	private dataView = new DataView(this.buffer);
	private arrayView = new Uint8Array(this.buffer);

	/**
	 * The location in the buffer where bytes are written or read.
	 * This increases after every write, but can be freely changed.
	 * The buffer will be resized when necessary.
	 *
	 * @type number */
	private offset = 0;

	constructor() { }


	// Ensures that the buffer is large enough to write `size` bytes
	// at the current `this.offset`.
	accommodate(size: any) {
		var requiredLength = this.offset + size;
		if (this.buffer.byteLength >= requiredLength) {
			return;
		}

		var newLength = this.buffer.byteLength;
		while (newLength < requiredLength) {
			newLength *= 2;
		}

		var newBuffer = new ArrayBuffer(newLength);
		var newArrayView = new Uint8Array(newBuffer);
		newArrayView.set(this.arrayView);

		// If there's a gap between the end of the old buffer
		// and the start of the new one, we need to zero it out
		if (this.offset > this.buffer.byteLength) {
			newArrayView.fill(0, this.buffer.byteLength, this.offset);
		}

		this.buffer = newBuffer;
		this.dataView = new DataView(newBuffer);
		this.arrayView = newArrayView;
	}

	write(dataType: any, size: any, value: any) {
		this.accommodate(size);
		(<any>this.dataView)['set' + dataType](this.offset, value);
		this.offset += size;
		return this;
	}

	/**
	 * Returns the writen data as a slice from the internal buffer,
	 * cutting off any padding at the end.
	 *
	 * @returns {ArrayBuffer} a [0, offset] slice of the interal buffer */
	getData () {
		this.accommodate(0);  /* make sure the offset is inside the buffer */
		return this.buffer.slice(0, this.offset);
	};

	public w = {

		/**
		 * @method module:nbt.Writer#byte
		 * @param {number} value - a signed byte
		 * @returns {module:nbt.Writer} itself */
		[tagTypes.byte]: this.write.bind(this, 'Int8', 1),

		/**
		 * @method module:nbt.Writer#ubyte
		 * @param {number} value - an unsigned byte
		 * @returns {module:nbt.Writer} itself */
		ubyte: this.write.bind(this, 'Uint8', 1),

		/**
		 * @method module:nbt.Writer#short
		 * @param {number} value - a signed 16-bit integer
		 * @returns {module:nbt.Writer} itself */
		[tagTypes.short]: this.write.bind(this, 'Int16', 2),

		/**
		 * @method module:nbt.Writer#int
		 * @param {number} value - a signed 32-bit integer
		 * @returns {module:nbt.Writer} itself */
		[tagTypes.int]: this.write.bind(this, 'Int32', 4),

		/**
		 * @method module:nbt.Writer#float
		 * @param {number} value - a signed 32-bit float
		 * @returns {module:nbt.Writer} itself */
		[tagTypes.float]: this.write.bind(this, 'Float32', 4),

		/**
		 * @method module:nbt.Writer#float
		 * @param {number} value - a signed 64-bit float
		 * @returns {module:nbt.Writer} itself */
		[tagTypes.double]: this.write.bind(this, 'Float64', 8),

		/**
		 * As JavaScript does not support 64-bit integers natively, this
		 * method takes an array of two 32-bit integers that make up the
		 * upper and lower halves of the long.
		 *
		 * @method module:nbt.Writer#long
		 * @param {Array.<number>} value - [upper, lower]
		 * @returns {module:nbt.Writer} itself */
		[tagTypes.long]: (value: any) => {
			this.w[tagTypes.int](value[0]);
			this.w[tagTypes.int](value[1]);
			return this;
		},

		/**
		 * @method module:nbt.Writer#byteArray
		 * @param {Array.<number>|Uint8Array|Buffer} value
		 * @returns {module:nbt.Writer} itself */
		[tagTypes.byteArray]: (value: any) => {
			this.w[tagTypes.int](value.length);
			this.accommodate(value.length);
			this.arrayView.set(value, this.offset);
			this.offset += value.length;
			return this;
		},

		/**
		 * @method module:nbt.Writer#intArray
		 * @param {Array.<number>} value
		 * @returns {module:nbt.Writer} itself */
		[tagTypes.intArray]: (value: any) => {
			this.w[tagTypes.int](value.length);
			var i;
			for (i = 0; i < value.length; i++) {
				this.w[tagTypes.int](value[i]);
			}
			return this;
		},

		/**
		 * @method module:nbt.Writer#longArray
		 * @param {Array.<number>} value
		 * @returns {module:nbt.Writer} itself */
		[tagTypes.longArray]: (value: any) => {
			this.w[tagTypes.int](value.length);
			var i;
			for (i = 0; i < value.length; i++) {
				this.w[tagTypes.long](value[i]);
			}
			return this;
		},

		/**
		 * @method module:nbt.Writer#string
		 * @param {string} value
		 * @returns {module:nbt.Writer} itself */
		[tagTypes.string]: (value: any) => {
			var bytes = encodeUTF8(value);
			this.w[tagTypes.short](bytes.length);
			this.accommodate(bytes.length);
			this.arrayView.set(bytes, this.offset);
			this.offset += bytes.length;
			return this;
		},

		/**
		 * @method module:nbt.Writer#list
		 * @param {Object} value
		 * @param {number} value.type - the NBT type number
		 * @param {Array} value.value - an array of values
		 * @returns {module:nbt.Writer} itself */
		[tagTypes.list]: (value: any) => {
			this.w[tagTypes.byte]((<any>tagTypes)[value.type]);
			this.w[tagTypes.int](value.value.length);
			var i;
			for (i = 0; i < value.value.length; i++) {
				this.w[value.type](value.value[i]);
			}
			return this;
		},

		/**
		 * @method module:nbt.Writer#compound
		 * @param {Object} value - a key/value map
		 * @param {Object} value.KEY
		 * @param {string} value.KEY.type - the NBT type number
		 * @param {Object} value.KEY.value - a value matching the type
		 * @returns {module:nbt.Writer} itself
		 *
		 * @example
		 * writer.compound({
		 *     foo: { type: 'int', value: 12 },
		 *     bar: { type: 'string', value: 'Hello, World!' }
		 * }); */
		[tagTypes.compound]: (value: any) => {
			Object.keys(value).map((key) => {
				this.w[tagTypes.byte]((<any>tagTypes)[value[key].type]);
				this.w[tagTypes.string](key);
				this.w[value[key].type](value[key].value);
			});
			this.w[tagTypes.byte](tagTypes.end);
			return this;
		},
	};

};

/**
 * In addition to the named writing methods documented below,
 * the same methods are indexed by the NBT type number as well,
 * as shown in the example below.
 *
 * @constructor
 * @see module:nbt.Writer
 *
 * @example
 * var reader = new nbt.Reader(buf);
 * int x = reader.int();
 * int y = reader[3]();
 * int z = reader[tagTypes.int](); */
export class Reader {

	/**
	 * The current location in the buffer. Can be freely changed
	 * within the bounds of the buffer.
	 *
	 * @type number */
	private offset = 0;

	private arrayView: Uint8Array;
	private dataView: DataView;

	constructor(public buffer: any) {
		if (!buffer) { throw new Error('Argument "buffer" is falsy'); }
		this.arrayView = new Uint8Array(buffer);
		this.dataView = new DataView(this.arrayView.buffer);
	}

	read(dataType: any, size: any) {
		var val = (<any>this.dataView)['get' + dataType](this.offset);
		this.offset += size;
		return val;
	}

	private self() {
		return this;
	}

	public r = {
		/**
		 * @method module:nbt.Reader#byte
		 * @returns {number} the read byte */
		[tagTypes.byte]: this.read.bind(this, 'Int8', 1),

		/**
		 * @method module:nbt.Reader#byte
		 * @returns {number} the read unsigned byte */
		ubyte: this.read.bind(this, 'Uint8', 1),

		/**
		 * @method module:nbt.Reader#short
		 * @returns {number} the read signed 16-bit short  */
		[tagTypes.short]: this.read.bind(this, 'Int16', 2),

		/**
		 * @method module:nbt.Reader#int
		 * @returns {number} the read signed 32-bit integer */
		[tagTypes.int]: this.read.bind(this, 'Int32', 4),

		/**
		 * @method module:nbt.Reader#float
		 * @returns {number} the read signed 32-bit float */
		[tagTypes.float]: this.read.bind(this, 'Float32', 4),

		/**
		 * @method module:nbt.Reader#double
		 * @returns {number} the read signed 64-bit float */
		[tagTypes.double]: this.read.bind(this, 'Float64', 8),

		/**
		 * As JavaScript does not not natively support 64-bit
		 * integers, the value is returned as an array of two
		 * 32-bit integers, the upper and the lower.
		 *
		 * @method module:nbt.Reader#long
		 * @returns {Array.<number>} [upper, lower] */
		[tagTypes.long]: () => {
			return [this.r[tagTypes.int](), this.r[tagTypes.int]()];
		},

		/**
		 * @method module:nbt.Reader#byteArray
		 * @returns {Array.<number>} the read array */
		[tagTypes.byteArray]: () => {
			var length = this.r[tagTypes.int]();
			var bytes = [];
			var i;
			for (i = 0; i < length; i++) {
				bytes.push(this.r[tagTypes.byte]());
			}
			return bytes;
		},

		/**
		 * @method module:nbt.Reader#intArray
		 * @returns {Array.<number>} the read array of 32-bit ints */
		[tagTypes.intArray]: () => {
			var length = this.r[tagTypes.int]();
			var ints = [];
			var i;
			for (i = 0; i < length; i++) {
				ints.push(this.r[tagTypes.int]());
			}
			return ints;
		},

		/**
		 * As JavaScript does not not natively support 64-bit
		 * integers, the value is returned as an array of arrays of two
		 * 32-bit integers, the upper and the lower.
		 *
		 * @method module:nbt.Reader#longArray
		 * @returns {Array.<number>} the read array of 64-bit ints
		 *     split into [upper, lower] */
		[tagTypes.longArray]: () => {
			var length = this.r[tagTypes.int]();
			var longs = [];
			var i;
			for (i = 0; i < length; i++) {
				longs.push(this.r[tagTypes.long]());
			}
			return longs;
		},

		/**
		 * @method module:nbt.Reader#string
		 * @returns {string} the read string */
		[tagTypes.string]: () => {
			var length = this.r[tagTypes.short]();
			var slice = sliceUint8Array(this.arrayView, this.offset, this.offset + length);
			this.offset += length;
			return decodeUTF8(slice);
		},

		/**
		 * @method module:nbt.Reader#list
		 * @returns {{type: string, value: Array}}
		 *
		 * @example
		 * reader.list();
		 * // -> { type: 'string', values: ['foo', 'bar'] } */
		[tagTypes.list]: () => {
			var type = this.r[tagTypes.byte]();
			var length = this.r[tagTypes.int]();
			var values = [];
			var i;
			for (i = 0; i < length; i++) {
				values.push(this.r[type]());
			}
			return { type: tagTypeNames[type], value: values };
		},

		/**
		 * @method module:nbt.Reader#compound
		 * @returns {Object.<string, { type: string, value }>}
		 *
		 * @example
		 * reader.compound();
		 * // -> { foo: { type: int, value: 42 },
		 * //      bar: { type: string, value: 'Hello! }} */
		[tagTypes.compound]: () => {
			var values: Record<string, any> = {};
			while (true) {
				var type = this.r[tagTypes.byte]();
				if (type === tagTypes.end) {
					break;
				}
				var name = this.r[tagTypes.string]();
				var value = this.r[type]();
				values[name] = { type: tagTypeNames[type], value: value };
			}
			return values;
		}
	}
};

/**
 * @param {Object} value - a named compound
 * @param {string} value.name - the top-level name
 * @param {Object} value.value - a compound
 * @returns {ArrayBuffer}
 *
 * @see module:nbt.parseUncompressed
 * @see module:nbt.Writer#compound
 *
 * @example
 * nbt.writeUncompressed({
 *     name: 'My Level',
 *     value: {
 *         foo: { type: int, value: 42 },
 *         bar: { type: string, value: 'Hi!' }
 *     }
 * }); */
export const writeUncompressed = function(value: any) {
	if (!value) { throw new Error('Argument "value" is falsy'); }

	var writer = new Writer();

	writer.w[tagTypes.byte](tagTypes.compound);
	writer.w[tagTypes.string](value.name);
	writer.w[tagTypes.compound](value.value);

	return writer.getData();
};

/**
 * @param {ArrayBuffer|Buffer} data - an uncompressed NBT archive
 * @returns {{name: string, value: Object.<string, Object>}}
 *     a named compound
 *
 * @see module:nbt.parse
 * @see module:nbt.writeUncompressed
 *
 * @example
 * nbt.readUncompressed(buf);
 * // -> { name: 'My Level',
 * //      value: { foo: { type: int, value: 42 },
 * //               bar: { type: string, value: 'Hi!' }}} */
export const parseUncompressed = function(data: any) {
	if (!data) { throw new Error('Argument "data" is falsy'); }

	var reader = new Reader(data);

	var type = reader.r[tagTypes.byte]();
	if (type !== tagTypes.compound) {
		throw new Error('Top tag should be a compound');
	}

	return {
		name: reader.r[tagTypes.string](),
		value: reader.r[tagTypes.compound]()
	};
};

/**
 * @callback parseCallback
 * @param {Object} error
 * @param {Object} result - a named compound
 * @param {string} result.name - the top-level name
 * @param {Object} result.value - the top-level compound */

/**
 * This accepts both gzipped and uncompressd NBT archives.
 * If the archive is uncompressed, the callback will be
 * called directly from this method. For gzipped files, the
 * callback is async.
 *
 * For use in the browser, window.zlib must be defined to decode
 * compressed archives. It will be passed a Buffer if the type is
 * available, or an Uint8Array otherwise.
 *
 * @param {ArrayBuffer|Buffer} data - gzipped or uncompressed data
 * @param {parseCallback} callback
 *
 * @see module:nbt.parseUncompressed
 * @see module:nbt.Reader#compound
 *
 * @example
 * nbt.parse(buf, function(error, results) {
 *     if (error) {
 *         throw error;
 *     }
 *     console.log(result.name);
 *     console.log(result.value.foo);
 * }); */
export const parse = function(data: any, callback: any) {
	if (!data) { throw new Error('Argument "data" is falsy'); }

	if (!hasGzipHeader(data)) {
		callback(null, parseUncompressed(data));
	} else if (!zlib) {
		callback(new Error('NBT archive is compressed but zlib is not ' +
			'available'), null);
	} else {
		/* zlib.gunzip take a Buffer, at least in Node, so try to convert
				if possible. */
		var buffer;
		if (data.length) {
			buffer = data;
		} else if (typeof Buffer !== 'undefined') {
			buffer = new Buffer(data);
		} else {
			/* In the browser? Unknown zlib library. Let's settle for
					Uint8Array and see what happens. */
			buffer = new Uint8Array(data);
		}

		zlib.gunzip(buffer, function(error, uncompressed) {
			if (error) {
				callback(error, null);
			} else {
				callback(null, parseUncompressed(uncompressed));
			}
		});
	}
};
