import Search from './models/Search';
import Recipe from './models/Recipe';
import Likes from './models/Likes';
import List from './models/List';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import {clearLoader, elements, renderLoader} from './views/base'; // DOM elements
import {countReload} from './config'; // DOM elements

/*-- Global state of the app --/
* - Search object
* - Current recipe object
* - Shopping list object
* - Linked recipes
------------------------------*/
const state = {};

/**** Search controller ****/
const controlSearch = async () => {

    // 1) Get input query from searchView
    const query = searchView.getInput();

    if(query){
        // 2) New search object and add to state
        state.search = new Search(query);

        // 3) Prepare UI for results
        searchView.clearInput();
        searchView.clearResult();
        renderLoader(elements.searchRes);

        try{
            // 4) Search for recipe
            await state.search.getResults();

            // 5) Render result on UI
            searchView.renderResults(state.search.result);
            clearLoader();
        }catch(err){
            //
            if(JSON.parse(localStorage.getItem('count') == 50)){
                alert('Your API key is expired, please change API key and remove localstorage count');
            }
            console.log(err)
            alert('Somthing went wrong with the search :(')
            clearLoader();
        }
    }
}

/*---- Search btn submit event ----*/
elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    // clear url hash & recipe DOM container
    recipeView.clearRecipe();
    window.location.hash = '';
    controlSearch();
    countReload();
})

/*---- next / prev btns click event, using target.closest ----*/
elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline'); // traverse upwards from the current clicked 'e' all the way up to the '.btn-inline' element.
    if(btn){
        searchView.clearResult();
        const goToPage = parseInt(btn.dataset.goto, 10); // return next page number (2, 3, 4)
        searchView.renderResults(state.search.result, goToPage);
    }
});


/****  Recipe controller ****/
const controlRecipe = async () => {
    // Get ID from url
    const id = window.location.hash.replace('#','');

    if(id){
        // Prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipesContainer);

        // Highlight selected search
        if(state.search) searchView.highlightSelected(id);

        // Create new recipe object
        state.recipe = new Recipe(id);


        try {
            // Get recipe data & call to parseIngrediens()
            await state.recipe.getRecipe(); // await cause getRecipe is async function, it will only executed after we get back with the data.

            state.recipe.parseIngredients();

            // Calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();

            // Render recipe
            clearLoader();
            recipeView.renderRecipe(
                state.recipe,
                state.likes ? state.likes.isLiked(id) : false
            );
        }catch(err){
            console.log(err)
            alert('Error processing recipe!')
        }
    }else{
        console.log('No ID')
    }
};


/*---- hashchange & load event ----*/
// add the same event listener to different events. Ex: window.addEventListener('hashchange', controlRecipe); & window.addEventListener('load', controlRecipe);
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));


/**** List controller ****/
const controlList = () => {

    // 1) Create a new list IF there in none yet
    if(!state.shopingList) state.shopingList = new List();

    // 2) Create a new shopingList ingridiens obj and markup
    state.recipe.ingredients.forEach(ing => {
        const ingridients = state.shopingList.addItemsIng(ing.count, ing.unit, ing.ingredient);
        listView.renderIngridients(ingridients)
    });

    // 3) Create a new item
    state.shopingList.additem(state.recipe.id, state.recipe.title);

    // 4) Create item markup and render to UI
    listView.renderList(state.recipe);

    // Clear this.ingredientsList = [];
    state.shopingList.ingredientsList = [];

}

/*---- Handle delete & update shopingList events ----*/
elements.shoppingList.addEventListener('click', e => {

    // 1. get item & ing ID
    const itemID = e.target.closest('.item-wrapper').dataset.itemid;
    const ingID = e.target.closest('.shopping__item') ? e.target.closest('.shopping__item').dataset.ingid : false;

    // 2. delete ingridients from item
    if(e.target.matches('.shopping__delete-ingridient, .shopping__delete-ingridient *')){
        // Delete from state
        state.shopingList.deleteIng(itemID, ingID);
        // Delete from Ui
        listView.deleteIngUI(ingID);
        //console.log(ingId);
        console.log('delete ingridient');
    }

    // 3. Handle the count update
    else if(e.target.matches('.shopping__count-value')){
        const val = parseFloat(e.target.value, 10); // change to num
        if(val > 0){
            state.shopingList.updateCount(itemID, ingID, val);
        }
        console.log('ing count');
    }
    // 4. delete item
    else if (e.target.matches('.shopping__delete-item, .shopping__delete-item *')) {
        // Remove item from state.shopingList
        state.shopingList.deleteItems(itemID);
        // Remove item from UI list
        listView.deleteItemUI(itemID);

        console.log('delete item');
        // clear state.shopingList & localStorage if itemsList length = 0
        if (state.shopingList.itemsList.length < 1) {
            localStorage.removeItem('shopingList');
            delete state.shopingList;
        }
    }

    // 5. Toggle open / close class
    else if (e.target.matches('.item-header, .item-header *')) {
        listView.toggleClass(itemID);
        console.log('close class toggle');
    }

});

/**** Likes controller ****/
const controlLike = () => {
    if(!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;

    // User has NOT yet liked current recipe
    if(!state.likes.isLiked(currentID)){
        // Add like to the state
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img)

        // Toggle the like button
        likesView.toggleLikeBtn(true);

        // Add like to UI list
        likesView.renderLike(newLike);
    }
    // User HAS liked current recipe
    else {
        // Remove like from the state.likes
        state.likes.deleteLike(currentID);

        // Toggle the like button
        likesView.toggleLikeBtn(false);

        // Remove like from UI list
        likesView.deleteLike(currentID);
    }

    if(state.likes && state.likes.likes.length > 0) {
        // Display likes menu (if has likes)
        likesView.toggleLikeMenu(state.likes.getNumLikes());
    }else{
        // Clean state,likes & localStorage
        likesView.toggleLikeMenu(false);
        localStorage.removeItem('likes');
        delete state.likes;
    }
}

// Restore liked recipes on page load
window.addEventListener('load', () => {
    // restore likes
    localStorage.getItem('likes') ? (state.likes = new Likes(), state.likes.readStorage()) : likesView.toggleLikeMenu(false);

    // render the existing shopingList
    if(localStorage.getItem('shopingList')){
        state.shopingList = new List();
        state.shopingList.readStorage();
        state.shopingList.itemsList.forEach(item => listView.renderList(item));
    }else{
        //console.log('Empty shopingList')
    }

    if(state.likes){
        // toggle like menu button
        likesView.toggleLikeMenu(state.likes.getNumLikes());

        // render the existing likes
        state.likes.likes.forEach(like => likesView.renderLike(like));
    }

    // count reload, one key is available for 50 reloads
    if(window.location.hash !== "" || !JSON.parse(localStorage.getItem('count'))){
        countReload();
    }

    // todo: close all shopingList items

    // focus on search field
    elements.searchInput.focus();
});

/*---- Handling recipe buttons clicks (servings des/inc, add to shopping list ) ----*/
// increasing / decreasing servings, event delegation, because all of these elements, that we're trying to select here, they're not yet on the DOM
elements.recipesContainer.addEventListener('click', e => {
    // decrease servings
    if(e.target.matches('.btn-decrease, .btn-decrease *')){
        if(state.recipe.servings > 1){
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    }
    // decrease servings
    else if (e.target.matches('.btn-increase, .btn-increase *')){
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    }
    // Add ingredients to shopping list
    else if(e.target.matches('.recipe_btn--add, .recipe_btn--add *')){

        // Checking if shoping list item is already exist, if exist = dont add new one. if not exist create state.shopingList & run controlList()
        state.shopingList && state.shopingList.itemsList.find(item => item.id === state.recipe.id) ? false : controlList();
    }
    // add recipe to like menu
    else if(e.target.matches('.recipe__love, .recipe__love *')){
        controlLike(); // like controller
    }
})

elements.logo.addEventListener('click', e => {
    window.location.href = window.location.href.substr(0, window.location.href.indexOf('#'));
})

window.state = state;
console.log('--- state & localStorage ---');
console.log('state: ', state);
console.log('localStorage: ', localStorage);
console.log('----------------------------')

/***** Todo List *****
 * fix reload counter

 * click on logo rediret to home page
 window.location.hash ='';
 window.location.href

 */
