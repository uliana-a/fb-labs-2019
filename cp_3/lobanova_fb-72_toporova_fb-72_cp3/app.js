const fs = require('fs');

const commonBigrams = ['ст', 'но', 'ен', 'то', 'на'];

const alphabet = ['а', 'б', 'в', 'г', 'д', 'е', 'ж', 'з', 'и', 'й', 'к', 'л', 'м', 'н', 'о', 'п',
'р', 'с', 'т', 'у', 'ф', 'х', 'ц', 'ч', 'ш', 'щ', 'ь', 'ы', 'э', 'ю', 'я'];

readAndParse = (path) => {
    let text = fs.readFileSync(path, 'utf-8');
    return text.replace(/\s/g, '');
}

const getFiveMostFreq = (text) => {
    const bigramFreq = {};
    const bigramAmount = Math.floor(text.length / 2);
    const result = [];

    for (let i = 0; i < text.length - 1; i+=2) {
        let bigram = text.slice(i, i+2);
        bigramFreq[bigram] ? bigramFreq[bigram]++ : bigramFreq[bigram] = 1;
    }
    for (let key in bigramFreq) {
        bigramFreq[key] = bigramFreq[key] / bigramAmount;
    }
    let entries = Object.entries(bigramFreq);    
    let sorted = entries.sort((a, b) => b[1] - a[1]).slice(0, 5);
    for (let i in sorted) {
        result.push(sorted[i][0]);
    }
    fs.appendFileSync('results.txt', 'Five most frequent bigram:\n'); 
    result.forEach((val, i) => {
        fs.appendFileSync('results.txt', `${i + 1}: ${val}\n`); 
    })
    return result;
}

const getGcd = (a, b) => {
    if (b === 0) return a;
    return getGcd(b, a % b);
}

const euclideanAlgorithm = (a, b, x1 = 1, y1 = 0, x2 = 0, y2 = 1) => {
    if (b === 0) {
        return y1;
    }
    return euclideanAlgorithm(
        b, 
        a%b, 
        x2, 
        y2, 
        x1 - (Math.floor(a / b) * x2), 
        y1 - (Math.floor(a / b) * y2)
    );
} 

const getBigramAlphabet = () => {
    const arr = [];
    for (let i in alphabet) {
        for (let j in alphabet) {
            arr.push(alphabet[i] + alphabet[j]);
        }
    };
    return arr;
}

const solveEquation = (a, b, n) => {
    const gcd = getGcd(n, a);
    switch(gcd) {
        case 1:
            let inverse = euclideanAlgorithm(n, a);
            inverse = inverse >= 0 ? inverse : inverse + n;
            return [ (inverse * b) % n ];
        default:
            if (b % gcd === 0) {
                const solutions = [];
                for (let i = 0; i < gcd; i++) {
                    solutions.push(solveEquation(a / gcd, b / gcd, n / gcd)[0] + i * (n / gcd));
                }
                return solutions;
            } else return false;
    }
}

const getKeys = (bigrams, alphabet) => {
    const keys = [];
    for (let i in bigrams) {
        const x1 = alphabet.indexOf(bigrams[i][0].a);
        const y1 = alphabet.indexOf(bigrams[i][0].b);
        const x2 = alphabet.indexOf(bigrams[i][1].a);
        const y2 = alphabet.indexOf(bigrams[i][1].b);
        const a = x1 - x2 > 0 ? x1 - x2 : x1 - x2 + 961;
        const b = y1 - y2 > 0 ? y1 - y2 : y1 - y2 + 961;
        const values = solveEquation(a, b, 961);
        if (values) {
            values.forEach(value => {
                if (a === 0) return;
                if(keys.find(({ a }) => a === value)) return;
                const b = y1 - (value * x1) % 961;
                const key = {
                    a: value,
                    b: b > 0 ? b : b + 961
                }
                keys.push(key);
            });
        }
    }
    return keys;
}

const findBigramsComb = (theory, bigrams) => {
    const arr = [], result = [];
    for (let i in bigrams) {
        for (let j in theory) {
            arr.push({
                b: bigrams[i],
                a: theory[j]
            })
        }
    }
    for (let i = 0; i < 24; i++) {
        for (let j = i + 1; j < 25; j++) {
            result.push([arr[i], arr[j]]);
        }
    }
    return result;
}

const decipher = (cipher, a, b, alphabet) => {
    let text = '';
    if (getGcd(961, a) !== 1) {
        fs.appendFileSync('results.txt', "iversed doesn't exist\n");
        return;
    }
    let inverse = euclideanAlgorithm(961, a);
    inverse = inverse >= 0 ? inverse : inverse + 961;

    for (let i = 0; i < cipher.length - 1; i += 2) {
        const y = alphabet.indexOf(cipher.slice(i, i+2));
        const diff = y - b > 0 ? y - b : y - b + 961;
        const result = (inverse * diff) % 961;
        text += alphabet[result];
    }
    return text;
}

const checkText = (text) => {
    const notExisting = ['аь', 'оь', 'уь', 'еь', 'ыь', 'иь', 'эь', 'яь', 'юь', 'йь', 'йй', 'ьь', 'ыы', 'ьы'];
    
    return !notExisting.some(bg => {
        if (text.indexOf(bg) + 1) {
            fs.appendFileSync('results.txt', `there is a bigram ${bg}, this text isn't correct\n`);
            return true;
        }
    });
}

const getText = (keys, cipher, alphabet) => {
    for (let i in keys) {
        fs.appendFileSync('results.txt', `key: (${keys[i].a}, ${keys[i].b})\n`);
        const text = decipher(cipher, keys[i].a, keys[i].b, alphabet);
        if (text && checkText(text)) {
            fs.appendFileSync('decrypted.txt', text);
            fs.appendFileSync('results.txt', '\n\nCorrect text\n\n');
        }
    }
}
 
const text = readAndParse('09.txt');
const bigramAlphabet = getBigramAlphabet();
const bigramsComb = findBigramsComb(commonBigrams, getFiveMostFreq(text));
const keys = getKeys(bigramsComb, bigramAlphabet);
getText(keys, text, bigramAlphabet);