const fs = require('fs');

const alphabet = {
    'а': 0, 'б': 1, 'в': 2, 'г': 3, 'д': 4, 'е': 5, 
    'ж': 6, 'з': 7, 'и': 8, 'й': 9, 'к': 10, 'л': 11, 
    'м': 12, 'н': 13, 'о': 14, 'п': 15, 'р': 16, 'с': 17, 
    'т': 18, 'у': 19, 'ф': 20, 'х': 21, 'ц': 22, 'ч': 23, 
    'ш': 24, 'щ': 25, 'ъ': 26, 'ы': 27, 'ь': 28, 'э': 29, 
    'ю': 30, 'я': 31
};

const key2 = 'но';
const key3 = 'нос';
const key4 = 'носо';
const key5 = 'носок';
const key10 = 'ехидничать';
const key15 = 'автокомпенсатор';
const key20 = 'воздухонепроницаемый';

const readAndParse = (path) => {
    let text = fs.readFileSync(path, 'utf-8');
    text = text.toLowerCase();
    text = text.replace(/[^а-яё ]/g, " ");
    text = text.replace(/\s/g, '');
    text = text.replace(/ё/g, 'е');
    return text.trim();
}

const encrypt = (text, key) => {
    let cipher = '';
    const keyLength = key.length;
    for (let i = 0; i < text.length; i++) {
        const index = (alphabet[text[i]] + alphabet[key[i % keyLength]]) % 32;
        cipher += Object.keys(alphabet).find(key => alphabet[key] === index);
    }
    calcCoincidenceIndex(cipher, key);
}

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

fs.appendFileSync('results.txt', 'ЗАШИФРУВАННЯ\n')
const text = readAndParse('text.txt');
calcCoincidenceIndex(text, '');
encrypt(text, key2);
encrypt(text, key3);
encrypt(text, key4);
encrypt(text, key5);
encrypt(text, key10);
encrypt(text, key15);
encrypt(text, key20);