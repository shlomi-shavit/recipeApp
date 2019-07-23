export const elements = {
    searchForm: document.querySelector('.search'),
    searchInput: document.querySelector('.search__field'),
    searchRes: document.querySelector('.results'),
    searchResList: document.querySelector('.results__list'),
    searchResPages: document.querySelector('.results__pages'),
    recipesContainer: document.querySelector('.recipe'),
    shoppingList: document.querySelector('.shopping__list'),
    likesMenu: document.querySelector('.likes__field'),
    likesList: document.querySelector('.likes__list'),
    logo: document.querySelector('.header__logo')
}

export const elementsStrings = {
    loader: 'loader'
}

export const limitRecipeTitle = (title, limit = 17) => {
    const newTitle = [];
    if(title.length > limit ){
        title.split(' ').reduce((accumulator, current) => {
            if(accumulator + current.length <= limit){
                newTitle.push(current)
            }
            return accumulator + current.length; //return the total text length
        }, 0);

        //return the result
        return `${newTitle.join(' ')}...`;
    }else {
        return title
    }
}

export const renderLoader = element => {
    const loader = `
        <div class="${elementsStrings.loader}">
            <svg>
                <use href="img/icons.svg#icon-cw"/></use>            
            </svg>
        </div>`;
    element.insertAdjacentHTML('afterbegin', loader)
}

export const clearLoader = () => {
    const loader = document.querySelector(`.${elementsStrings.loader}`)
    if(loader){
        loader.parentElement.removeChild(loader);
    }
}