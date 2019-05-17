const a = 1;

const p = Promise.resolve('resolved!');

p.then(d=>{
    console.log(d);
});

;var string = "foo💩bar";
var match = string.match(/foo(.)bar/u);