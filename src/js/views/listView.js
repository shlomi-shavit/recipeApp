import {elements, limitRecipeTitle} from './base'; // DOM elements

export const clearList = () => {
    elements.shoppingList.innerHTML = '';
};

export const renderIngridients = itemIng => {
    var liMarkup = `
    <li class="shopping__item" data-ingid=${itemIng.uniqid}>
        <div class="shopping__count">
            <input type="number" value="${itemIng.count}" min="0" step="${itemIng.count}" class="shopping__count-value">
            <p>${itemIng.unit}</p>
        </div>
        <p class="shopping__description">${itemIng.ingredient}</p>
        <button class="shopping__delete-ingridient btn-tiny">
            <svg>
                <use href="img/icons.svg#icon-circle-with-cross"></use>
            </svg>
        </button>
    </li>`;
    return liMarkup;
}

export const renderList = recipe => {
    var ulMarkup = `
        <ul class='item-wrapper' data-itemid=${recipe.id}>
           <div class="item-header">
               <div class="arrow"></div>
               <span>${limitRecipeTitle(recipe.title)}</span>
                <button class="shopping__delete-item btn-tiny">
                    <svg>
                        <use href="img/icons.svg#icon-circle-with-cross"></use>
                    </svg>
                </button>
            </div>
            ${recipe.ingredients.map(ing => renderIngridients(ing)).join('')}
        </ul>`;

    elements.shoppingList.insertAdjacentHTML('beforeend', ulMarkup);
}

export const toggleClass = id => {
    const listEl = document.querySelector(`[data-itemid="${id}"]`);
    if(listEl) listEl.classList.toggle('close');
}

export const deleteIngUI = id => {
    const item = document.querySelector(`[data-ingid="${id}"]`);
    if(item) item.parentElement.removeChild(item);
}

export const deleteItemUI = id => {
    const item = document.querySelector(`[data-itemid="${id}"]`);
    if(item) item.parentElement.removeChild(item);
}