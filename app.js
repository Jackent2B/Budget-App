
//Module1 BudgetController
var budgetController = (function(){

	var Expense = function(id,description,value){
		this.id = id,
		this.description = description,
		this.value = value,
		this.percentage = -1;
	};

	Expense.prototype.calculatePercent = function(totalincome){
			if(totalincome>0){
			this.percentage = Math.round((this.value/totalincome)*100);
		}else{
			this.percentage = -1;
		}
	};

	Expense.prototype.getPercent = function(){
		return this.percentage;
	}

	var Income = function(id,description,value){
		this.id = id,
		this.description = description,
		this.value = value;
	};

	var calculateTotal = function(type){
		var sum = 0;
		data.allItems[type].forEach(function(current){ //current is either the income or the expense object
			sum += current.value; //current is either exp or inc
		})

		data.totals[type]=sum;

	};


//to store our data(Method 1)

	//	var allExpenses = []; //to store all the expense objects.
	//	var allIncomes = []; //to store all the income objects.

//better method to store our data(Method 2)

	var data = {
		allItems:{
			exp:[],
			inc:[]
		},
		totals:{
			exp:0,
			inc:0
		},
		budget:0,
		percentage: -1, //-1 is the value that we generally uses for something which is not existent. or use 0 if you want
		percentArr:[]
	};

	//public method
	return {
		addItem: function(type,des,val){
			var newItem,ID;

			//ID
			//[1 2 3 4 5],next ID = 6
			//[1 2 4 6 8],next ID = 9
			//therefore next ID is last ID +1
			
			//create new ID
			if(data.allItems[type].length>0){
				ID = data.allItems[type][data.allItems[type].length-1].id+1;

			}else{
				ID=0;
			}

			//create new item based on 'inc' or 'exp' type.
			if(type === 'exp'){
				newItem = new Expense (ID,des,val);
		}
			else{
				newItem = new Income(ID,des,val);
			}

		//push it into our data structure
		data.allItems[type].push(newItem);
		return newItem;
		},

		deleteItem: function(type,id){

	        //ID
			//[1 2 3 4 5],next ID = 6
			//[1 2 4 6 8],next ID = 9
			//therefore next ID is last ID +1

			//VERY VERY IMPORTANT
			//difference between map and forEach function is that 
			//Map() returns a completely new array with elements whereas
			//forEach() returns existing array with with elements   
			var ids = data.allItems[type].map(function(current){
			return current.id; 
			});
 
			var index = ids.indexOf(id);
			if(index !== -1){
				//splice() method is used to delete elements from an array.
				data.allItems[type].splice(index,1); //splice() method takes two arguments i.e. First is the index number from which elements has to be deleted and second is till when they have to be deleted. 
			}

		},



		calculateBudget: function(){
			//calculate total income and expenses
			calculateTotal('exp');
			calculateTotal('inc');

			//calculate the budget: income-expenses
			data.budget = data.totals.inc - data.totals.exp

			//calculate the percentage of income that we spent
			if(data.totals.inc > 0){ 
			data.percentage = Math.round((data.totals.exp/data.totals.inc)*100);
			}
			else{
			data.percentage = -1;
			}
		},
		getBudget: function(){
			return {
				budget: "+"+data.budget,
				totalExp:data.totals.exp,
				totalInc: data.totals.inc, 
				percentage: data.percentage

			}
		},

		calculatePercentage: function(){
			
		
		/*
		a=20
		b=10
		c=40
		income = 100
		so a% = (20/100)*100;
		   b% = (10/100)*100;
		   c% = (40/100)*100;
		*/

			data.allItems.exp.forEach(function(current){
				current.calculatePercent(data.totals.inc);

			});
		},

		getPercentages: function(){
			var allPercents = data.allItems.exp.map(function(current){
				return current.getPercent();
			});
			return allPercents;
		},



		//of NO use , just for testing
		testing: function(){
			console.log(data);
		}

	}
})();

//Module2 UI Controller
var UIcontroller = (function(){

//we have used this so that we dont have to change their name manually at all the positions incase needed
	var DOMstrings = {
		inputbtn: '.add__btn',
		inputType : '.add__type',
		inputDescription: '.add__description',
		inputValue: '.add__value',
		incomeContainer: '.income__list',
		expensesContainer: '.expenses__list',
		budgetLabel: '.budget__value',
		incomeLabel: '.budget__income--value',
		expensesLabel: '.budget__expenses--value',
		percentageLabel: '.budget__expenses--percentage',
		container: '.container',
		expensesPercentLabel: '.item__percentage'
	};

	var formatNumber = function(num,type){
		var numSplit,int,decimal;
		/*
		+ or - before number
		exactly 2 decimal points
		comma seprating the thousands

		2310.4567 --> +2,310.46
		2000 --> +2,000.00
		*/

		//abs() -->absolute . It removes the sign of the numbers
		num = Math.abs(num);
		/*
		here number is a primitive datatype but then also we can use methods over them.
		It happens because the moment we use method over primitive dataTypes ,
		JavaScript automatically converts primitive datatypes into objects and thus
		we can use methods over them.   
		*/
		//toFixed rounds off the number and returns specifted no. decimal places after a number.

		num = num.toFixed(2);

		//spliting integer part and decimal part using split() method
		numSplit = num.split('.'); // note split() works on string only
		int = numSplit[0]; //it returns as string
		if(int.length>3){ //it means greater than 3 digits as each will be treated as a character.
			// int.substr(0,1)+',' + int.substr(1,3); //input 23510, but output is 2,3510 which is what we dont wanted.			
		//so now,	
			int = int.substr(0,int.length-3)+ ',' + int.substr(int.length-3,3); //input 23510, output 23,510			
		}

		decimal = numSplit[1]; //it also returns as strings
		
		//Adding '-' or '+' sign

		type === 'exp' ? sign ='-': sign = '+';
		return sign + ' ' + int + '.' + decimal;
	};

			//here we have taken the use of first class functions 
		var nodeListForEach = function(list,callback){
			for(var i=0;i<list.length; i++){
				callback(list[i],i);
			}
		};


 //It is the public method which we can access
	return {
		getinput: function(){
			// var type = document.querySelector('.add__type').value;  /*will be either inc or exp . These are name of values enterd in '.add__type' class.*/
			// var description = document.querySelector('.add__description').value;
			// var value = document.querySelector('.add__value').value;

/*But there is a problem here which is that we want to return all the three values
but here we can return only one variable at a time.
SOLUTION: return a single object instead of three different variables
and use these three variables as property inside of the object
*/			
	return{

			// type : document.querySelector('.add__type').value, //will be either inc or exp . These are name of values enterd in '.add__type' class.*/
			type : document.querySelector(DOMstrings.inputType).value, //will be either inc or exp . These are name of values enterd in '.add__type' class.*/
			//Similarly for others 
		    description : document.querySelector(DOMstrings.inputDescription).value,
		    //here we have used parseFloat to convert strings into numbers
			value : parseFloat(document.querySelector(DOMstrings.inputValue).value) 

		};
	},

//adding data to UI (Lecture:83)
	addListItem: function(obj, type){
		var html,newHtml,element;
		//create HTML strings with placeholder text
		
		if(type === 'inc'){
			element = DOMstrings.incomeContainer;
			html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i> </button></div></div></div>'
		}
		else{
			element = DOMstrings.expensesContainer;
			html = ' <div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"> <div class="item__value">%value%</div>  <div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
		}
		
		//Replace the placeholder text with some actual data

		//replace() method is used to replace something with another.
		newHtml = html.replace('%id%',obj.id);
				//here we have used newHtml in place of html because in first one we have assigned everything in newHtml variable. 
		newHtml = newHtml.replace('%description%',obj.description);
		
		newHtml = newHtml.replace('%value%',formatNumber(obj.value,type));

		//Insert the HTML into the DOM using insertAdjacentHTML()
		
		document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);
		//Lecture no. 83 -- Important
		//syntax: element.insertAdjacentHTML(position,text);

	},

	deleteListItem: function(selectorID){
		//IMPORTANT
		/*In JavaScript we can not delete an element with Id directly but instead we can only
		delete child elements.
		Therefore, in order to delete a element we first have to move to its parent element than delete the element which we wants to delete
		because now the element which we wants to delete becomes a child element as we went to its parent element using parentNode.
		This all thing seems to be silly but it is true. 
	    */
	    var el = document.getElementById(selectorID);
		el.parentNode.removeChild(el);

	},

	//to clear HTML fields
	clearFields: function(){
		var fields;
	 	fields = document.querySelectorAll(DOMstrings.inputDescription+','+DOMstrings.inputValue);
	//NOTE: querySelectorAll returns  list instead of an array so we have to convert this list into array. 
	//we can use slice() method to convert list into array.
	//but we can not use it directly as field.slice() because afterall field is still a list
	//we will do it like this

	var fieldsArr = Array.prototype.slice.call(fields);

	//forEach : we can use it on foreach
	//function within foreach can at max have three arguments.
	fieldsArr.forEach(function(current,index,array){ // here we don't needed the use of index and array argument 
		current.value = ""; //current is either inputDescription or inputValue.
	});

	//to highlight inputDescription field again.
	fieldsArr[0].focus();
	},

	//to display the budget  in UI
	displayBudget: function(obj){
		var type;
		obj.budget>=0?type='inc':type='exp';

		document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget,type);
		document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc,'inc');
		document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp,'exp');
		if(obj.percentage > 0){
		document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
		}
		else{
		document.querySelector(DOMstrings.percentageLabel).textContent = '---';
		}
	},

	displayPercentages: function(percentages){

		//it will return a nodeList or simply a list but not an array.
		var fields = document.querySelectorAll('.item__percentage');
		//so we have to use either slice() method here .
		//But we have another better method i.e. by creating our on forEach().


		nodeListForEach(fields,function(current,index){

			if(percentages[index]>0){
				current.textContent = percentages[index]+'%';
			}else{
				current.textContent = '---';
			}

		});

	},

	displayMonth: function(){
		var now,year,month;
//using Date() constructor
		now = new Date();
		//var christmas = new Date(2018,11,25);
		
		months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
		month = now.getMonth();//it returns the month number.

		year = now.getFullYear();
		document.querySelector('.budget__title--month').textContent = months[month] + ' ' + year;
			},


	changedType: function(){
		var fields = document.querySelectorAll(
			DOMstrings.inputType + ',' +
			DOMstrings.inputDescription + ',' +
			DOMstrings.inputValue);
		/*NOTE: querySelectorAll returns a nodeList instead of array so we can not use
				forEach() here.
		*/

		nodeListForEach(fields,function(current){
			current.classList.toggle('red-focus');
		});

		document.querySelector(DOMstrings.inputbtn).classList.toggle('red');

	},

	getDOMstrings: function(){
		return DOMstrings;
	}


	};

})();


//connection
//Global App controller
var controller = (function(budgetctrl,uictrl){

//function initialisation starts
//here we hva put all the event listeners
		var setupEventListeners = function(){
			var DOM = uictrl.getDOMstrings();
			//making button work
	document.querySelector('.add__btn').addEventListener('click',ctrlAddItem);

			//making enter key work
	/*here we have not used querySelector because 'keypress' event does not happen 
	on a particular class or id but rather on the whole page.
	event: It is simply an argument which tells which key is pressed.*/
	
	document.addEventListener('keypress',function(event){
	
	//every key on keyboard has a unique keyCode.
	if(event.keyCode === 13 || event.which === 13){
		
		ctrlAddItem();

	}
	});


	//we have added event listener on '.container' because it is the parent of both income and expense tag 
	//with respect to using it according to event delegation 
	document.querySelector('.container').addEventListener('click', ctrlDeleteItem);
	//change event tells to change when event has happened.
	document.querySelector(DOM.inputType).addEventListener('change',uictrl.changedType);

};

//function initialisation ends

var updateBudget = function(){

	//calculate the budget
	/*But  change value as stings into value as nubers because calulationscan not be made on strings */
	budgetctrl.calculateBudget();

	//return the budget
	var budget = budgetctrl.getBudget();

	//Display the budget on the UI
	uictrl.displayBudget(budget);
	//

};

var updatePercentages = function(){

	//1.calculate the percentages
	budgetctrl.calculatePercentage();


	//2.read the percentages from the budget controller
	var percentages = budgetctrl.getPercentages()

	//3. update the UI with new percentages
	uictrl.displayPercentages(percentages);



}

		
	var ctrlAddItem = function(){
		var input,newItem;

		//1.get the field input data
		var input = uictrl.getinput();

		if(input.description !== "" && !isNaN(input.value) && input.value>0){ //isNaN is to check Not a Number.
		//2.add the item to the budget controller
		var newItem = budgetctrl.addItem(input.type, input.description, input.value);

		//3. Add the item to the UI
        uictrl.addListItem(newItem,input.type);
    	
		//4. clear the HTML fields
		uictrl.clearFields();

		//5. Calculate and update the budget and display budget
		updateBudget();
		//6. update and display percentage
		updatePercentages();
	}
		

	};


	var ctrlDeleteItem = function(event){
		var itemID,splitID;
		//target property is used to get the element on which event has fired.
		
		//parentNode is used for DOM Traversing. It means that we can move up in a DOM that is in HTML tags to their parents using DOM. 
		itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
		
		if(itemID){ //it will work only on the elements which has some id

		//	split() method splits the string into different and assigns its parts in an array 
			splitID = itemID.split('-'); //example: it will split 'inc-1' into an array as ["inc",1];
			type = splitID[0];
			ID = parseInt(splitID[1]);

			//1. Delete the item from the data structure
			budgetctrl.deleteItem(type,ID);

			//2. Delete the item form UI
			uictrl.deleteListItem(itemID);

			//3. update and show the budget 
			updateBudget();
			//percenyages
			updatePercentages();

		}
		}

//earlier here was the whole code present which is now present in setupEventListeners()
	return {
		init: function(){
			console.log('Application has started.');
			uictrl.displayMonth();
			uictrl.displayBudget({
				//so that everything initially to be displayed as 0
				budget: 0,
				totalExp:0,
				totalInc: 0, 
				percentage: 0

			});
			setupEventListeners();
		}
	};

})(budgetController,UIcontroller);

controller.init();