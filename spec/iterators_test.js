var _ = Iterators;

describe("Iterators.keyIterator", function() {
    it("should return an iterator over an object's keys", function() {
        var input = { foo: "bar", baz: "xyzzy" },
            iter = _.keyIterator(input);
        
        expect(iter.next()).toEqual("foo");
        expect(iter.next()).toEqual("baz");
    });
});

describe("Iterators.valueIterator", function() {
    it("should return an iterator over an object's values", function() {
        var input = { foo: "bar", baz: "xyzzy" },
            iter = _.valueIterator(input);
        
        expect(iter.next()).toEqual("bar");
        expect(iter.next()).toEqual("xyzzy");
    });
});

describe("Iterators.toIterator", function() {

    it("should return an iterator verbatim", function() {
        var iter = _.toIterator([1, 2, 3]);
        
        expect(_.toIterator(iter)).toEqual(iter);
    });
    
    it("should convert an array to an array iterator", function() {
        var input = [1, 2, 3],
            iter = _.toIterator(input);
        
        expect(iter.next()).toEqual(1);
        expect(iter.next()).toEqual(2);
        expect(iter.next()).toEqual(3);
    });
    
    it("should convert an object to an entry iterator", function() {
        var input = { foo: "bar", baz: "xyzzy" },
            iter = _.toIterator(input);
        
        expect(iter.next()).toEqual({key: "foo", value: "bar"});
        expect(iter.next()).toEqual({key: "baz", value: "xyzzy"});
    });
    
});

describe("Iterators.toArray", function() {
    it("should convert an iterator into an array", function() {
        var input = [1, 2, 3],
            iter = _.toIterator(input);
        
        expect(_.toArray(iter)).toEqual(input);
    });
});

describe("Iterators.map", function() {
    it("should return a lazy iterator", function() {
        var input = [1, 2, 3],
            f = jasmine.createSpy('map function'),
            iter = _.map(input, f);
        
        expect(f).wasNotCalled();
        iter.next();
        expect(f).toHaveBeenCalledWith(1);
    });
    
    it("should apply the supplied function to each element in the iterator", function() {
        var input = [1, 2, 3];
        expect(_.toArray(_.map(input, function(n) { return n * 2; }))).toEqual([2, 4, 6]);
    });
    
});

describe("Iterators.project", function() {
   it("should perform a map projecting the supplied property", function() {
       var input = [{x: 1, y: 10},
                    {x: 2, y: 20}];
       
       expect(_.toArray(_.project(input, "x"))).toEqual([1, 2]);
       expect(_.toArray(_.project(input, "y"))).toEqual([10, 20]);
   });
});

describe("Iterators.filter", function() {
    it("should return a lazy iterator", function() {
        var input = [1, 2, 3],
            p = jasmine.createSpy('predicate'),
            iter = _.filter(input, p);
    
        expect(p).wasNotCalled();
        iter.hasNext();
        expect(p).toHaveBeenCalledWith(1);
    });
    
    it("should return an iterator over the elements matched by the supplied predicate", function() {
        var input = [1, 2, 3, 4, 5, 6],
            isEven = function(number) { return ((number >> 1) << 1) === number; };
        
        expect(_.toArray(_.filter(input, isEven))).toEqual([2, 4, 6]);
    });
});

describe("Iterators.toObject", function() {
    it("should convert an entry iterator into an object", function() {
        var input = { foo: "bar", baz: "xyzzy" },
            iter = _.toIterator(input);
        
        expect(_.toObject(iter)).toEqual(input);
    });
});

describe("Iterators.reduce", function() {
    it("should apply the reduction using the first element of the iterator as seed value " +
       "if none is supplied", function() {
        var input = [1, 2, 3],
            sum = function(a, b) { return a + b; };
        
        expect(_.reduce(input, sum)).toEqual(6);
    });
    
    it("should use the given seed value if it is supplied", function() {
        var input = [1, 2, 3],
            sum = function(a, b) { return a + b; };
        
        expect(_.reduce(input, sum, 4)).toEqual(10);
    });
});