const fs = require('fs');

readAndParse = (path) => {
    let text = fs.readFileSync(path, 'utf-8');
    text = text.toLowerCase();
    text = text.replace(/[^а-яё ]/g, " ");
    text = text.replace(/\s\s+/g, " ");
    text = text.replace(/ё/g, 'е');
    text = text.replace(/ъ/g, 'ь');
    return text.trim();
}

removeSpaces = (text) => {
    return text.replace(/\s/g, '');
}

sortFrequencies = (obj) => {
    let entries = Object.entries(obj);    
    let sorted = entries.sort((a, b) => b[1] - a[1]);
    sorted.forEach(freq => {
        fs.appendFileSync('results.txt', `'${freq[0]}': ${freq[1]}\n`);
    })
}

const calcLetterFrequency = (text) => {
    const lttrFreq = {};
    const textLength = text.length;
    const arrText = text.split('');

    arrText.forEach(lttr => {
        lttrFreq[lttr] ? lttrFreq[lttr]++ : lttrFreq[lttr] = 1;
    });

    for (let key in lttrFreq) {
        lttrFreq[key] = lttrFreq[key] / textLength;
    };

    return lttrFreq;
};

const calcBigramCrossFreq = (text) => {
    const bigramFreq = {};
    const bigramAmount = text.length - 1;

    for (let i = 0; i < bigramAmount; i++) {
        let bigram = text.slice(i, i+2);
        bigramFreq[bigram] ? bigramFreq[bigram]++ : bigramFreq[bigram] = 1;
    }

    for (let key in bigramFreq) {
        bigramFreq[key] = bigramFreq[key] / bigramAmount;
    }

    return bigramFreq;
}

const calcBigramFreq = (text) => {
    const bigramFreq = {};
    const bigramAmount = Math.floor(text.length / 2);

    for (let i = 0; i < text.length - 1; i+=2) {
        let bigram = text.slice(i, i+2);
        bigramFreq[bigram] ? bigramFreq[bigram]++ : bigramFreq[bigram] = 1;
    }
    for (let key in bigramFreq) {
        bigramFreq[key] = bigramFreq[key] / bigramAmount;
    }

    return bigramFreq;
}

const calcMonogramEntropy = (freq) => {
    let entropy = 0;
    for (let key in freq) {
        entropy += freq[key] * Math.log2(freq[key]);
    }
    return - entropy;
}

const calcBigramEntropy = (freq) => {
    return calcMonogramEntropy(freq) / 2;
}

fs.appendFileSync('results.txt', 'З ПРОБІЛАМИ\n\n');
const text = readAndParse('text.txt');
const lttrFreq = calcLetterFrequency(text);
const bigramFreqCross = calcBigramCrossFreq(text);
const bigramFreq = calcBigramFreq(text);

fs.appendFileSync('results.txt', 'ЕНТРОПІЇ\n');
fs.appendFileSync('results.txt', `Ентропія монограм: ${calcMonogramEntropy(lttrFreq)}\n`);
fs.appendFileSync('results.txt', `Ентропія біграм з перетином: ${calcBigramEntropy(bigramFreqCross)}\n`);
fs.appendFileSync('results.txt', `Ентропія біграм без перетину: ${calcBigramEntropy(bigramFreq)}`);

fs.appendFileSync('results.txt', '\n\nЧАСТОТА ЛІТЕР\n');
sortFrequencies(lttrFreq);
fs.appendFileSync('results.txt', '\n\nЧАСТОТА БІГРАМ З ПЕРЕТИНОМ\n');
sortFrequencies(bigramFreqCross);
fs.appendFileSync('results.txt', '\n\nЧАСТОТА БІГРАМ БЕЗ ПЕРЕТИНУ\n');
sortFrequencies(bigramFreq);


fs.appendFileSync('results.txt', '\n\n\nБЕЗ ПРОБІЛІВ\n\n');
const text2 = removeSpaces(text);
const lttrFreq2 = calcLetterFrequency(text2);
const bigramFreqCross2 = calcBigramCrossFreq(text2);
const bigramFreq2 = calcBigramFreq(text2);

fs.appendFileSync('results.txt', 'ЕНТРОПІЇ\n');
fs.appendFileSync('results.txt', `Ентропія монограм: ${calcMonogramEntropy(lttrFreq2)}\n`);
fs.appendFileSync('results.txt', `Ентропія біграм з перетином: ${calcBigramEntropy(bigramFreqCross2)}\n`);
fs.appendFileSync('results.txt', `Ентропія біграм без перетину: ${calcBigramEntropy(bigramFreq2)}`);

fs.appendFileSync('results.txt', '\n\nЧАСТОТА ЛІТЕР\n');
sortFrequencies(lttrFreq2);
fs.appendFileSync('results.txt', '\n\nЧАСТОТА БІГРАМ З ПЕРЕТИНОМ\n');
sortFrequencies(bigramFreqCross2);
fs.appendFileSync('results.txt', '\n\nЧАСТОТА БІГРАМ БЕЗ ПЕРЕТИНУ\n');
sortFrequencies(bigramFreq2);



