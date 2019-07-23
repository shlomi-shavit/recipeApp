import axios from 'axios';
import {apiKey} from '../config';

export default class Recipe {
    constructor(id){
        this.id = id;
    }

    async getRecipe (){
        try{
            const results = await axios(`https://www.food2fork.com/api/get?key=${apiKey}&rId=${this.id}`); // ajax call, return promise
            this.title = results.data.recipe.title;
            this.author = results.data.recipe.publisher;
            this.img = results.data.recipe.image_url;
            this.url = results.data.recipe.source_url;
            this.ingredients = results.data.recipe.ingredients
        }catch(error) {
            console.log(error)
            alert('Somthing went wrong :(')
        }
    }

    calcTime(){
        // 15 min for 3 ingredients
        const ingredientsNum = this.ingredients.length;
        const periods = Math.ceil(ingredientsNum / 3);
        this.time = periods * 15;
    }

    calcServings(){
        this.servings = 4;
    }

    parseIngredients() {
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoon', 'teaspoons', 'cups', 'pounds'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        const units =[...unitsShort, 'kg', 'g'];

        const newIngredients = this.ingredients.map(el => {
            // 1) uniform units
            let ingredient = el.toLowerCase();

            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitsShort[i]);
            });

            // 2) remove parentheses
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

            // 3) Parse ingredients into an object(objInigredient) Properties: count, unit and ingredient
            const arrayIngrediens = ingredient.split(' ');
            const unitIndex = arrayIngrediens.findIndex(el2 => units.includes(el2)); // return index position of unitsShort unit within arrayIngrediens array, example: ["1", "tbsp", "cayenne", "pepper"] = 1(tbsp)

            let objInigredient;
            if (unitIndex > -1) {
                // There is a unit
                // We assume that everything that comes before the unit will always be a number.
                // Ex1: 4 1/2 cups, bla bla... , arrCount = [4, 1/2]
                const arrCount = arrayIngrediens.slice(0, unitIndex);

                // In case we have just one number before the unit --> Ex2: 4 cups, count is [4]
                let count;
                if (arrCount.length === 1) {
                    count = eval(arrayIngrediens[0].replace('-', '+')); // ["1-1/2", "bla1", "bla2"] --> ["1+1/2", "bla1", "bla2"]
                } else {
                    count = eval(arrayIngrediens.slice(0, unitIndex).join('+')); // ["4", "1/2", ...] = '4+1/2'
                }

                objInigredient = {
                    count, // dont need to specify count if count is count ( count: count ), Ex: "1+1/2" = "1.5"
                    unit: arrayIngrediens[unitIndex], // 'unit: tbsp', 'oz', cup ...
                    ingredient: arrayIngrediens.slice(unitIndex + 1).join(' ') // return the rest of the array and parse it to string
                    /* ingredient: if we don't specify the second argument in slice() so it goes all the way to the end, which is what we want. And so we have now, the entire array
                    except the first element.
                    The join(' ') put all these array elements back into a string. */
                }
            } else if (parseInt(arrayIngrediens[0], 10)) {
                // There is No unit, but 1st element is number <------------- ? check live example
                objInigredient = {
                    count: parseInt(arrayIngrediens[0], 10), // string to num
                    unit: '',
                    ingredient: arrayIngrediens.slice(1).join(' ') // return the rest of the array and parse it to string
                }
            } else if (unitIndex === -1) {
                // There is No unit & NO number in 1st position
                objInigredient = {
                    count: 1,
                    unit: '',
                    ingredient
                    // when we say ingredient: ingredient,we don't need the 2nt value, we can simply do it like this.
                    // instead of having to repeat it, we just put ingredient, and it will automatically then create this property ingredient,
                }
            }
            return objInigredient;
        })
        this.ingredients = newIngredients;
    } // And so that's the only way to find the position of the unit, when we don't really know, which unit we are looking for

    updateServings(type){
        // Servings
        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;

        // Ingredients
        this.ingredients.forEach(ing => {
            ing.count *= (newServings / this.servings); // ing.count = 4.5 * (5 / 4) = 5.625  ||  ing.count(4.5) * ( newServings(5) / this.servings(4) ) = 5.625
        })
        this.servings = newServings
    }
}