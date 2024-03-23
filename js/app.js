class CalorieTracker {
    constructor() {

       this._calorielimit= storage.getCalorieLimit();
       this._totalCalories = storage.getTotalCalories();
       this._meals = storage.getMeals();
       this._workouts= [];
       this._displayCalorieLimit();

       this._renderState()

    }

//     .....public method....

    addMeal(meal){
    this._meals.push(meal);

    this._totalCalories+= meal.calories;
    storage.updateTotalCalories(this._totalCalories);
    storage.saveMeal(meal);
        this._displayNewMeal(meal)

        this._renderState()
    }
    addWorkout(workout){
        this._workouts.push(workout);

        this._totalCalories-= workout.calories;
        storage.updateTotalCalories(this._totalCalories);
        this._displayNewWorkout(workout);
        this._renderState()

    }

    removeWorkout(id){
        const indexOfWorkout= this._workouts.findIndex( workout => workout.id === id);

        if (indexOfWorkout !== -1){
            const workout = this._workouts[indexOfWorkout];
            this._totalCalories +=workout.calories;

            storage.updateTotalCalories(this._totalCalories);
            this._workouts.splice(indexOfWorkout,1);
            this._renderState();

        }
    }

    removeMeal(id){
        const indexOfMeal= this._meals.findIndex( meal => meal.id === id);

             if (indexOfMeal !== -1){
                 const meal = this._meals[indexOfMeal];
                 this._totalCalories -=meal.calories;
                 storage.updateTotalCalories(this._totalCalories);
                 this._meals.splice(indexOfMeal,1);
                 this._renderState();
             }

    }

    reset(){
        this._totalCalories = 0;
        this._workouts = [];
        this._meals = [];
        storage.updateTotalCalories(this._totalCalories);
        this._renderState();
    }

    setLimit(calorieLimit){
        this._calorielimit= calorieLimit;
        storage.setCalorieLimit(calorieLimit);
        this._displayCalorieLimit();
        this._renderState()

    }

    loadItems(){
      const meals = storage.getMeals();
      meals.forEach(meal => this._displayNewMeal(meal));
    }



//     ....private method....

    _displayCaloriesTotal(){
        const caloriesTotalEle =document.getElementById('calories-total');
        caloriesTotalEle.innerHTML= this._totalCalories;
    }

    _displayCalorieLimit(){
    const caloriesLimitEle = document.getElementById('calories-limit');
    caloriesLimitEle.innerHTML= this._calorielimit
    }

    _displayCaloriesConsumed(){
        const caloriesConsumedEle= document.getElementById('calories-consumed');



       const consumed = this._meals.reduce((total, currentValue)=>{
           return  currentValue.calories+total
       },0);

       caloriesConsumedEle.innerHTML=consumed
    }

    _displayCaloriesBurned(){
        const caloriesConsumedEle= document.getElementById('calories-burned');



        const burned = this._workouts.reduce((total, currentValue)=>{
            return  currentValue.calories+total
        },0);

        caloriesConsumedEle.innerHTML=burned;
    }

    _displayCaloriesRemaining(){
        const caloriesRemainingEle=document.getElementById('calories-remaining');

        const remaining=this._calorielimit - this._totalCalories;
        caloriesRemainingEle.innerHTML= remaining;

        if (remaining <= 0){
            caloriesRemainingEle.parentElement.parentElement.classList.remove('bg-light')
            caloriesRemainingEle.parentElement.parentElement.classList.add('bg-danger');
        }else {
            caloriesRemainingEle.parentElement.parentElement.classList.remove('bg-danger')
            caloriesRemainingEle.parentElement.parentElement.classList.add('bg-light');
        }
    }

    _displayCaloriesProgress(){
        const progressBarEle=document.getElementById('calorie-progress');
        const percentage = (this._totalCalories / this._calorielimit)*100;
        const width = Math.min(percentage,100);
        progressBarEle.style.width=`${width}%`;
    }

    _displayNewMeal(meal){
        const mealsEle = document.getElementById('meal-items');

        const mealEle=document.createElement('div');
        mealEle.classList.add('card','my-2');
        mealEle.innerHTML=`<div class="card-body" data-id="${meal.id}" >
                <div class="d-flex align-items-center justify-content-between">
                    <h4 class="mx-1">${meal.name}</h4>
                    <div
                        class="fs-1 bg-primary text-white text-center rounded-2 px-2 px-sm-5"
                    >
                        ${meal.calories}
                    </div>
                    <button class="delete btn btn-danger btn-sm mx-2">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
            </div>`
                mealsEle.appendChild(mealEle);




    }
    _displayNewWorkout(workout){
        const workoutsEle = document.getElementById('workout-items');
    const workoutEle =document.createElement('div');
    workoutEle.classList.add('card','my-2');
    workoutEle.innerHTML=`<div class="card-body" data-id="${workout.id}">
                <div class="d-flex align-items-center justify-content-between">
                  <h4 class="mx-1">${workout.name}</h4>
                  <div
                    class="fs-1 bg-secondary text-white text-center rounded-2 px-2 px-sm-5"
                  >${workout.calories}
                  </div>
                  <button class="delete btn btn-danger btn-sm mx-2">
                    <i class="fa-solid fa-xmark"></i>
                  </button>
                </div>
              </div>`

                    workoutsEle.appendChild(workoutEle);

    }

    _renderState(){
        this._displayCaloriesTotal();
        this._displayCaloriesConsumed();
        this._displayCaloriesBurned();
        this._displayCaloriesRemaining();
        this._displayCaloriesProgress();
    }
}

 class Meal{
    constructor(name,calories) {
     this.id = Math.random().toString(16).slice(2);
     this.name = name;
     this.calories = calories ;
    }
 }
class Workout{
    constructor(name,calories) {
        this.id = Math.random().toString(16).slice(2);
        this.name = name;
        this.calories = calories ;
    }
}

class storage {
    static getCalorieLimit(defaultLimit=2200){
        let calorieLimit;
        if (localStorage.getItem('calorieLimit') === null) {
            calorieLimit= defaultLimit;
        } else {
            calorieLimit= localStorage.getItem('calorieLimit')*1;
        }
        return calorieLimit;
    }
    static setCalorieLimit(calorieLimit){
        localStorage.setItem('calorieLimit',calorieLimit);
    }

    static getTotalCalories(defaultTotalCalories= 0){
        let totalCalories;
        if (localStorage.getItem('totalCalories') === null) {
            totalCalories= defaultTotalCalories;
        } else {
            totalCalories= localStorage.getItem('totalCalories')*1;
        }
        return totalCalories;
    }
    static updateTotalCalories(calories){
        localStorage.setItem('totalCalories',calories);
    }

    static getMeals(){
        let meals;
        if (localStorage.getItem('meals') === null) {
            meals= [];
        } else {
            meals=JSON.parse(localStorage.getItem('meals')) ;
        }
        return meals;
    }
    static saveMeal(meal){
        const  meals= storage.getMeals();
        meals.push(meal);
        localStorage.setItem('meals',JSON.stringify(meals));
    }

    static getWorkouts(){
        let workouts;
        if (localStorage.getItem('workouts') === null) {
            workouts= [];
        } else {
            workouts=JSON.parse(localStorage.getItem('workouts')) ;
        }
        return workouts;
    }
    static saveWorkout(workout){
        const  workouts= storage.getWorkouts();
        workouts.push(workout);
        localStorage.setItem('workout',JSON.stringify(wor));
    }


}
// const calTracker = new CalorieTracker();
// const run = new Workout('morning Run',200);
// const breakfast = new Meal('breakfast',500);
//
// calTracker.addWorkout(run);
// calTracker.addMeal(breakfast);

class App {
    constructor() {
        this._tracker= new CalorieTracker();

        document.getElementById('meal-form').addEventListener('submit',this._newMeal.bind(this));

        document.getElementById('workout-form').addEventListener('submit',this._newWorkout.bind(this));


        document.getElementById('meal-items').addEventListener('click',this._removeItems.bind(this,'meal'));

        document.getElementById('workout-items').addEventListener('click',this._removeItems.bind(this,'workout'));

        document.getElementById('filter-meals').addEventListener('keyup',this._filterItems.bind(this, 'meal'));
        document.getElementById('filter-workouts').addEventListener('input',this._filterItems.bind(this, 'workout'));
        document.getElementById('reset').addEventListener('click',this._reset.bind(this));
        document.getElementById('limit-form').addEventListener('submit',this._setLimit.bind(this));

        this._tracker.loadItems();

    }
//     ....private method ...
    _newMeal(evt){
        evt.preventDefault();
        const name = document.getElementById('meal-name');
        const calories = document.getElementById('meal-calories');

        if (name.value==="" || calories.value===""){
            alert("this item can not be empty");
            return 0;
        }
        const meal= new Meal(name.value,calories.value*1);

        this._tracker.addMeal(meal);

        name.value='';
        calories.value='';

    }

    _newWorkout(evt){
        evt.preventDefault();
        const name = document.getElementById('workout-name');
        const calories = document.getElementById('workout-calories');

        if (name.value==="" || calories.value===""){
            alert("this item can not be empty");
            return 0;
        }
        const workout= new Workout(name.value,calories.value*1);

        this._tracker.addWorkout(workout);

        name.value='';
        calories.value='';

    }

    _removeItems(type,evt){
        if (evt.target.classList.contains('delete') || evt.target.classList.contains('fa-solid')){

            const id = evt.target.closest('.card-body').getAttribute('data-id');

            if (type === 'meal'){
                this._tracker.removeMeal(id);
            }else{
                this._tracker.removeWorkout(id);
            }

            evt.target.closest('.card').remove();
        }
    }


    _filterItems(type,evt){
        console.log(evt.target.value)
       const searchValue= evt.target.value.toLowerCase();
       document.querySelectorAll(`#${type}-items .card`).forEach(item =>{
           const name = item.firstElementChild.firstElementChild.textContent.toLowerCase();
            if (name.indexOf(searchValue)!== -1){
                item.style.display='block';
            } else {
                item.style.display='none'
            }
        })
    }

_reset(){
        this._tracker.reset();

       if (confirm('Are you sure')){
           document.getElementById('workout-items').innerHTML = '';
           document.getElementById('meal-items').innerHTML = '';
           document.getElementById('filter-meals').innerHTML = '';
           document.getElementById('filter-workouts').innerHTML = '';
       }

}

  _setLimit(evt){
        evt.preventDefault();
        const Limit = document.getElementById('Limit');
        if (Limit.value === ''){
            alert("at first fill the input");
            return 0;
        }
        this._tracker.setLimit(Limit.value*1);
      Limit.value= '';
  }
}


const app = new App();



