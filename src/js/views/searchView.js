import {elements, limitRecipeTitle} from './base'; // DOM elements

export const getInput = () => elements.searchInput.value; // one line its automatically return

export const clearInput = () => {
    elements.searchInput.value = '';
};

export const clearResult = () => {
    elements.searchResList.innerHTML = '';
    elements.searchResPages.innerHTML = '';
};

export const highlightSelected = id => {
    const resultsArr = Array.from(document.querySelectorAll('.results__link'));
    resultsArr.forEach(el => el.classList.remove('results__link--active'));

    document.querySelector(`.results__link[href*="#${id}"]`).classList.add('results__link--active');
}

const renderRecipe = recipe => {
    const markup = `
        <li>
            <a class="results__link" href="#${recipe.recipe_id}">
                <figure class="results__fig">
                    <img src="${recipe.image_url}" alt="${recipe.image_url}">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>
    `;
    elements.searchResList.insertAdjacentHTML('beforeend' ,markup); //---> what is the order here
};

// type: 'prev' or 'next'
const createButton = (page, type) => `
        <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
            <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
            <svg class="search__icon">
                <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
            </svg>
        </button>
`;

const renderButtons = (page, totalResults, resultPerPage) => { // 1, 30, 10
    const pages = Math.ceil(totalResults / resultPerPage); // 3
    let button;

    if(page === 1 && pages > 1){
        // Next button only
        button = createButton(page, 'next');
    }else if(page < pages){ // 1 < 3
        // Both buttons
        button = `
        ${createButton(page, 'next')}
        ${createButton(page, 'prev')}
        `;
    }else if(page === pages && pages > 1){
        // Prev button only
        button = createButton(page, 'prev');
    }
    elements.searchResPages.insertAdjacentHTML('beforeend' ,button);
}

export const renderResults = (recipes, page = 1, resultPerPage = 10) => {
    // render result of current page
    const start = (page - 1) * resultPerPage; // 0,10,20...
    const end = page * resultPerPage; // 10,20,30...
    recipes.slice(start, end).forEach(renderRecipe); // <------------ check why its work without parameter //recipes.forEach(renderRecipe(recipes)) //recipes.forEach(renderRecipe(el => renderRecipe(el)))

    // render pagination buttons
    renderButtons(page, recipes.length, resultPerPage);
};
