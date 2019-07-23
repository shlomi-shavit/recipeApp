import uniqid from 'uniqid';

export default class List {
    constructor(){
        this.itemsList = [];
        this.ingredients = [];
    }

    additem(id, title){
        const item = {
            id,
            title,
            ingredients: this.ingredients
        }

        this.itemsList.push(item);

        //Persist the data in local storage.
        this.storingData();

        return item;
    }

    addItemsIng(count, unit, ingredient){
        const itemIngredient = {
            uniqid: uniqid(),
            count,
            unit,
            ingredient
        }
        this.ingredients.push(itemIngredient);

        //Persist the data in local storage.
        return itemIngredient;
    }

    deleteItems(itemID){
        const itemIndex = this.itemsList.findIndex(item => item.id === itemID);
        this.itemsList.splice(itemIndex, 1); // remove index from itemsList array

        //Persist the data in local storage.
        this.storingData()
    }

    deleteIng(itemID, ingID){
        // 1. current item ID
        const itemIndex = this.itemsList.findIndex(item => item.id === itemID);
        // 2. current ing ID
        const ingIndex = this.itemsList[itemIndex].ingredients.findIndex(ing => ing.uniqid === ingID);
        // 3. delete ingridient from itemList[].ingridients
        this.itemsList[itemIndex].ingredients.splice(ingIndex, 1); // remove index from items array
        // 4. Save data in local storage.
        this.storingData()
    }

    updateCount(itemID, ingID, newCount){
        // 1. current item ID
        const itemIndex = this.itemsList.findIndex(item => item.id === itemID);
        // 2. Find ingridient.count and set to newCount
        this.itemsList[itemIndex].ingredients.find(ing => ing.uniqid == ingID).count = newCount; // return the item itself, Ex: items.find(el => el.id === 8) --> return {id: 8}
        // 3. Save data in local storage.
        this.storingData();
    }

    storingData(){
        localStorage.setItem('shopingList', JSON.stringify(this.itemsList))
    }

    readStorage(){
        const storage = JSON.parse(localStorage.getItem('shopingList'));

        // Restore likes from the localStorage
        if(storage){
            this.itemsList = storage;
        }

        return storage;
    }
}