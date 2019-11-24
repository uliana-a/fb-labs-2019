const fs = require('fs');

const alphabet = {
    'а': 0, 'б': 1, 'в': 2, 'г': 3, 'д': 4, 'е': 5, 
    'ж': 6, 'з': 7, 'и': 8, 'й': 9, 'к': 10, 'л': 11, 
    'м': 12, 'н': 13, 'о': 14, 'п': 15, 'р': 16, 'с': 17, 
    'т': 18, 'у': 19, 'ф': 20, 'х': 21, 'ц': 22, 'ч': 23, 
    'ш': 24, 'щ': 25, 'ъ': 26, 'ы': 27, 'ь': 28, 'э': 29, 
    'ю': 30, 'я': 31
};

const cipher = fs.readFileSync('variant.txt', 'utf-8').replace(/\s/g, '');

const calcCoincidenceIndex = (text, key) => {
    const freq = {};
    let sum = 0;
    for (let i = 0; i < text.length; i++) {
        freq[text[i]] = freq[text[i]] ? ++freq[text[i]] : 1;
    }
    for (let key in freq) {
        sum += freq[key] * (freq[key] - 1);
    }
    fs.appendFileSync('results.txt', 
        `\n${!!key ? key : 'відкритий текст'}: ${sum / (text.length * (text.length - 1))}`);
}

const calcBlockCoincidence = (length) => {
    let block = '';
    for (let i = 0; i < cipher.length; i+=length) {
        if (!cipher[i]) return;
        block += cipher[i];
    }
    calcCoincidenceIndex(block, length);
} 

const breakIntoBlocks = () => {
    const arr = [];
    for (let i = 0; i < cipher.length; i++) {
        arr[i % 15] = arr[i % 15] ? arr[i % 15] + cipher[i] : cipher[i];
    }
    return arr;
}

const findMostFreq = (text) => {
    const freq = {};
    for (let i = 0; i < text.length; i++) {
        freq[text[i]] = freq[text[i]] ? ++freq[text[i]] : 1;
    }
    let arr = Object.values(freq);
    let max = Math.max(...arr);
    return Object.keys(freq).find(key => freq[key] === max);
}

const findKey = (freqLetters) => {
    let key = '';
    freqLetters.forEach((letter, i) => {
        let index = (alphabet[letter] - alphabet[`${
            i === 3 || i === 14 ? 'а' : i === 10 ? 'и' : 'о'
        }`] + 32) % 32;
        key += Object.keys(alphabet).find(key => alphabet[key] === index);
    });
    return key;
}

const decrypt = (text, key) => {
    let result = '';
    const keyLength = key.length;
    for (let i = 0; i < text.length; i++) {
        const index = (alphabet[text[i]] - alphabet[key[i % keyLength]] + 32) % 32;
        result += Object.keys(alphabet).find(key => alphabet[key] === index);
    }
    fs.appendFileSync('results.txt', `\nРозшифрований текст:\n${result}`);
}

fs.appendFileSync('results.txt', '\nРОЗШИФРУВАННЯ\n')

let keyLength = 2;
while (keyLength <= 30) {
    calcBlockCoincidence(keyLength);
    keyLength++;
}

const blocks = breakIntoBlocks();

const mostFreq = blocks.map(findMostFreq);
decrypt(cipher, findKey(mostFreq))


