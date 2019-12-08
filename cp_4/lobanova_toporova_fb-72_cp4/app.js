const fs = require('fs');

const firstPol = [1, 0, 0, 1, 0, 0, 1, 1, 1, 0, 1, 0, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 0, 0, 0];
const secondPol = [1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 0];

const getAutocorr = (result, period, file) => {
    for (let d = 0; d < 11; d ++) {
        let amount = 0;
        for (let i = 0; i < period; i++) {
            amount += (Number(result[i]) + Number(result[(i + d) % period])) % 2;
        }
        fs.appendFileSync(file, `${d}: ${amount}\n`);
    }
} 

const generateNGrams = (n, i = 1, res = [], str = '') => {
    [0, 1].forEach(val => {
        if (i === n) res.push(str + val);
        else generateNGrams(n, i + 1, res, str + val);
    });
    return res;
}

const getNGramsAmount = (result, n, file) => {
    const nGrams = generateNGrams(n);
    nGrams.forEach(ngram => {
        let amount = 0;
        for (let i = 0; i <= result.length - n; i += n) {
            if (result.slice(i, i + n) === ngram) amount ++;
        }
        fs.appendFileSync(file, `"${ngram}": ${amount}\n`);
    });
} 

const main = (arr, file) => {
    const start = Array(arr.length);
    start.fill(0, 0, arr.length - 1);
    start[arr.length - 1] = 1;
    startStr = '';
    let endStr = '';
    let period = 0;
    while (startStr !== start.join('')) {
        if (period === 0) startStr = start.join('');
        let sum = 0;
        let odd = 0;
        start.forEach((el, i) => {
            sum += el * arr[i];
            if (i === 0) odd = el;
            else if (i > 0) start[i - 1] = el;
            if (i === arr.length - 1) start[i] = sum % 2; 
        });
        endStr += odd;
        ++ period;
    }

    fs.appendFileSync(file, `${endStr}\n\nPeriod: ${period}\n Autocorrelation: \n`);

    getAutocorr(endStr, period, file);

    fs.appendFileSync(file, 'NGrams: \n');
    for (let i = 1; i < 6; i++) {
        getNGramsAmount(endStr, i, file)
    }
}

fs.appendFileSync('pol1_results.txt', 'FIRST POLYNOM\n\n');
main(firstPol, 'pol1_results.txt');
fs.appendFileSync('pol2_results.txt', 'SECOND POLYNOM\n\n');
main(secondPol, 'pol2_results.txt');
