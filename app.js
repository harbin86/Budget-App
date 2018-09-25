var budgetController = (function(){

	var Expense = function(id, description, value){
		this.id = id;
		this.description = description;
		this.value = value;
	};

	var Income = function(id, description, value){
		this.id = id;
		this.description = description;
		this.value = value;
	};

	var data = {
		allItems: {
			expense: [],
			income: []
		},
		totals: {
			exp: 0,
			inc: 0
		}
	};

	return{
		addItem: function(type,des,val){
			var newItem, ID;

			//Create new ID
			if(data.allItems[type].length > 0){
				ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
			}
			else{
				ID = 0;
			}
			
			//Create new Item, either expense or income
			if(type === 'expense'){
				newItem = new Expense(ID,des,val);
			}
			else if(type === 'income'){
				newItem = new Income(ID,des,val);
			}

			//Push it into data structure
			data.allItems[type].push(newItem);
			
			//return new item to global controller
			return newItem;
		},

		testing: function(){console.log(data);}
	};

})();

var UIController = (function(){

	//JS Object
	var DOMstrings = {
		inputType: '.add__type',
		inputDescription: '.add__description',
		inputValue: '.add__value',
		inputButton: '.add__btn'
	};

	return{
		getInput: function(){
			return{
				type: document.querySelector(DOMstrings.inputType).value,
				description: document.querySelector(DOMstrings.inputDescription).value,
				value: document.querySelector(DOMstrings.inputValue).value
			};
		},

		getDOMstrings: function(){
			return DOMstrings;
		}
	};

})();

//Global Controller
var controller  = (function(budgetCtrl,UICtrl){

	var setupEventListeners = function(){
		
		var DOM = UICtrl.getDOMstrings();
		
		document.querySelector(DOM.inputButton).addEventListener('click',ctrlAddItem);

		document.addEventListener('keypress',function(event){
			if(event.keyCode === 13 || event.which === 13){
				ctrlAddItem();
			}
		});
	};
	
	var ctrlAddItem = function(){
		var input = UICtrl.getInput();

		var newItem = budgetCtrl.addItem(input.type, input.description, input.value);
	};

	return{
		init: function(){
			setupEventListeners();
		}
	};

})(budgetController,UIController);

controller.init();