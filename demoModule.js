//modules
//we have also used iife here 
//module 1
var budgetController = (function(){
//these are private they can not be used outside this function	
	var x=23;
	var add=function(a){
		return x+a; 
	}

//it is a public method
//these type of methods which are made to be public are made as objects.
	return {
		publicTest: function(b){
			// console.log(add(b)); 
			return add(b);
		}
	}

}}();



//module 2
var UIcontroller = (function(){

	//some code

})();

//now, these two modules are completely seprated from each other so 
//we need to connect them
//connection
var controller = (function(bdgctrl,uictrl){
		var z = bdgctrl.publicTest(5);
		return {
			publicTest2: function(){
				console.log(z);
			}
		}
//here put the modules as arguments that we need to connect with each other. 
})(budgetController,UIcontroller);