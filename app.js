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

	var calculateTotal = function(type){
		var sum = 0;

		data.allItems[type].forEach(function(current){
			sum += current.value;
		});
		data.totals[type] = sum;
	};

	var data = {
		allItems: {
			expense: [],
			income: []
		},
		totals: {
			expense: 0,
			income: 0
		},
		budget:0,
		percentage:-1
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

		calculateBudget: function(){
			calculateTotal('expense');
			calculateTotal('income');

			//Calculate budget: income - expense
			data.budget = data.totals.income - data.totals.expense;

			//Calculate percentage of income spent: income / expense * 100
			if(data.totals.income > 0){
				data.percentage = Math.round((data.totals.expense / data.totals.income) * 100);
			}
			else{
				data.percentage = -1;
			}
		},

		getBudget: function(){
			return{
				budget: data.budget,
				totalIncome: data.totals.income,
				totalExpense: data.totals.expense,
				percentage: data.percentage
			};
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
		inputButton: '.add__btn',
		incomeContainer: '.income__list',
		expenseContainer: '.expenses__list',
		budgetLabel:'.budget__value',
		incomeLabel:'.budget__income--value',
		expenseLabel:'.budget__expenses--value',
		percentageLabel:'.budget__expenses--percentage'

	};

	return{
		getInput: function(){
			return{
				type: document.querySelector(DOMstrings.inputType).value,
				description: document.querySelector(DOMstrings.inputDescription).value,
				value: parseFloat(document.querySelector(DOMstrings.inputValue).value) //convert value from string to decimal
			};
		},

		addListItem: function(obj,type){
			
			var html, newHtml, element;

			//Create html with placeholder text
			if(type === 'income'){

				element = DOMstrings.incomeContainer;
				
				html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			}
			else if(type === 'expense'){
				
				element = DOMstrings.expenseContainer;

				html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			}

			//Replace placeholder text with data
			newHtml = html.replace('%id%',obj.id);
			newHtml = newHtml.replace('%description%',obj.description);
			newHtml = newHtml.replace('%value%',obj.value);

			//Insert into DOM
			document.querySelector(element).insertAdjacentHTML('beforeEnd', newHtml);
		},

		clearFields: function(){

			var fields, fieldsArray;

			fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);

			//Convert list to Array
			fieldsArray = Array.prototype.slice.call(fields);

			fieldsArray.forEach(function(current,index,array){
				current.value = "";
			});

			fieldsArray[0].focus();
		},

		displayBudget: function(obj){

			document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
			document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalIncome;
			document.querySelector(DOMstrings.expenseLabel).textContent = obj.totalExpense;
			
			
			if(obj.percentage > 0){
				document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
			}
			else{
				document.querySelector(DOMstrings.percentageLabel).textContent = '---';
			}

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
	
	var updateBudget = function(){

		//Calculate budget
		budgetCtrl.calculateBudget();

		//Return budget
		var budget = budgetCtrl.getBudget();
		
		//Display budget to UI
		UICtrl.displayBudget(budget);

	};

	var ctrlAddItem = function(){
		
		//Get user input
		var input = UICtrl.getInput();

		if(input.description !== "" && !isNaN(input.value) && input.value > 0){
			//Add item to Budget Controller
			var newItem = budgetCtrl.addItem(input.type, input.description, input.value);
			
			//Add item to the UI
			UICtrl.addListItem(newItem,input.type);

			/*document.querySelector('.add__description').value = "";
			document.querySelector('.add__value').value = "";*/

			//Clear fields
			UICtrl.clearFields();

			//Update Budget
			updateBudget();
		}
		
	};

	return{
		init: function(){
			UICtrl.displayBudget({
				budget: 0,
				totalIncome: 0,
				totalExpense: 0,
				percentage: -1
			});
			setupEventListeners();
		}
	};

})(budgetController,UIController);

controller.init();