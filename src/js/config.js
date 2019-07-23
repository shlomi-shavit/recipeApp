// that sensitive data should by be on server and not on client.
export const proxy = 'https://cors-anywhere.herokuapp.com/';

const apiKeysArray = [
    '1078e233f5562b8468defdf8fa015fa1',
    '33416def80bc0b47b777be8bb5442e19',
    '043a45c024434497e2d27cf4e08a4943',
    '0d39fb5e38924eec10bf8a3de451bd04',
    'b587700bd47717126afa64251086b1d2',
    '41d75a82cb0ba4e9fb9bee4b01f4447e'
];

// initial or get from localStorage
let keyIndex = localStorage.getItem('keyIndex') ? parseInt(localStorage.getItem('keyIndex')) : 0;
let count = localStorage.getItem('count') ? parseInt(localStorage.getItem('count')) : 1;

//parseInt(localStorage.getItem('keyIndex'));

/*---- count reloading ----*/
export const countReload = () => {

    if(count){

        if( count >= 49){
            keyIndex < apiKeysArray.length-1 ? keyIndex++ : keyIndex = 0;
            count = 1;
            storingCountData();
            console.log(`Your API key is expired, next API key is: ${keyIndex}`);
        }
        else if(count >= 40){
            console.log(`Your API key is going to expire, current API key is: ${keyIndex}`);
            count++;
            storingCountData();
        }
        else if( count >= 1){
            count++;
            storingCountData();
            console.log(`${50 - count} reloads left`)
        }
    }
}

const storingCountData = () => {
    localStorage.setItem("keyIndex", JSON.stringify(keyIndex));
    localStorage.setItem("count", JSON.stringify(count));
}

export const apiKey = apiKeysArray[keyIndex];