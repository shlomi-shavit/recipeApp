import axios from 'axios';
import {apiKey} from '../config';

// console.log('--------> apiKey');
// console.log(apiKey);
export default class Search {
    constructor (query) {
        this.query = query;
    }

    async getResults(){
        try{
            const results = await axios(`https://www.food2fork.com/api/search?key=${apiKey}&q=${this.query}`); // ajax call, return promise
            this.result = results.data.recipes;
        } catch(error){
            console.log(error);
        }
    }
}
