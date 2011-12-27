Iterators = (function() {
    var each, map, filter, reduce, toArray, toObject;
    
    function _map(iter, f) {
        return {
            hasNext: iter.hasNext,
            next: function() { return f(iter.next()); }
        };
    }
    
    function _each(iter, f) {
        while (iter.hasNext()) {
            f(iter.next());
        }
    }
    
    function _toArray(iter) {
        var array = [];
        _each(iter, function(item) { array.push(item); });
        return array;
    }
    
    function _toObject(iter) {
        var object = {};
        _each(iter, function(item) {
            object[item.key] = item.value;
        });
        return object;
    }
    
    function peekable(iter) {
        var buffer = undefined;
        if (iter.peek) { return iter; }
        return {
            hasNext: function() {
                if (buffer === undefined) {
                    return iter.hasNext();
                }
                return true;
            },
            next: function() {
                var result;
                if (buffer === undefined) {
                    result = iter.next();
                } else {
                    result = buffer;
                }
                buffer = undefined;
                return result;
            },
            peek: function() {
                if (buffer === undefined) {
                    buffer = iter.next();
                }
                return buffer;
            }
        };
    }
    
    function _filter(iter, p) {
        var peekableIter = peekable(iter);
        function hasNext() {
            while(peekableIter.hasNext()) {
                if (p(peekableIter.peek())) {
                    return true;
                }
                peekableIter.next();
            }
        }
        return {
            hasNext: hasNext,
            next: function() {
                if (hasNext()) {
                    return peekableIter.next();
                }
            }
        };
    }
    
    function _reduce(iter, f, seed) {
        var result = seed === undefined ? iter.next() : seed;
        while (iter.hasNext()) {
            result = f(result, iter.next());
        }
        return result;
    }
    
    function arrayIterator(array) {
        var i = 0;
        return {
            hasNext: function() { return i < array.length; },
            next: function() { return array[i++]; }
        };
    }
    
    function keyIterator(object) {
        var key = null, keys = [];
        for (key in object) {
            if (object.hasOwnProperty(key)) { keys.push(key); }
        }
        return arrayIterator(keys);
    }
    
    function valueIterator(object) {
        return _map(keyIterator(object), function(key) { return object[key]; });
    }
    
    function objectIterator(object) {
        return _map(keyIterator(object), function(key) {
            return { key: key, value: object[key] };
        });
    }
    
    function toIterator(arg) {
        if (arg.hasNext && arg.next) { return arg; }
        if (arg instanceof Array) {
            return arrayIterator(arg);
        }
        if (typeof arg === 'object') {
            return objectIterator(arg);
        }
        throw "Cannot convert argument to iterator: " + arg;
    }
    
    function convertArgToIterator(f) {
        return function() {
            var args = arguments;
            args[0] = toIterator(args[0]);
            return f.apply(f, args);
        };
    }
    
    each = convertArgToIterator(_each);
    map = convertArgToIterator(_map);
    filter = convertArgToIterator(_filter);
    reduce = convertArgToIterator(_reduce);
    toArray = convertArgToIterator(_toArray);
    toObject = convertArgToIterator(_toObject);
    
    return {
        each: each,
        map: map,
        filter: filter,
        reduce: reduce,
        keyIterator: keyIterator,
        valueIterator: valueIterator,
        toIterator: toIterator,
        toArray: toArray,
        toObject: toObject,
        project: function(value, propertyName) {
            return map(value, function(item) { return item[propertyName]; });
        },
        peekable: peekable
    };
}());