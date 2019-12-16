const BigNumber = require('bignumber.js');

var rl = require('readline-sync');

const getRandom = (min, max) => 
    BigNumber.random().multipliedBy(max.minus(min)).integerValue(BigNumber.ROUND_FLOOR).plus(min);

const euclideanAlgorithm = (
    a, b, x1 = new BigNumber(1), y1 = new BigNumber(0), x2 = new BigNumber(0), y2 = new BigNumber(1)
) => {
    if (b == 0) {
        return y1;
    }
    return euclideanAlgorithm(
        b, 
        a.modulo(b), 
        x2, 
        y2, 
        x1.minus(a.dividedBy(b).integerValue(BigNumber.ROUND_FLOOR).multipliedBy(x2)),
        y1.minus(a.dividedBy(b).integerValue(BigNumber.ROUND_FLOOR).multipliedBy(y2))
    );
} 

const checkPrime = (p) => {
    const primeNumbers = [ new BigNumber(2), new BigNumber(3), new BigNumber(5), 
        new BigNumber(7), new BigNumber(11), new BigNumber(13), new BigNumber(17) ];
    for (let i of primeNumbers) {
        if (p.modulo(i) == 0) return false;
    }
    return true;
}

const getGcd = (a, b) => {
    if (b == 0) return a;
    return getGcd(b, a.modulo(b));
}

const hornersMethod = (x, a, m) => {
    const arr = [];
    let temp = a;
    while (temp != 1) {
        if (temp.modulo(2) == 0) arr.unshift(new BigNumber(0));
        else arr.unshift(1);
        temp = temp.dividedBy(2).integerValue(BigNumber.ROUND_DOWN);
    }
    arr.unshift(new BigNumber(1));
    const result = arr.reduce((prev, curr, i) => {
        if (i !== arr.length - 1) return prev.multipliedBy(x.pow(curr)).modulo(m).pow(2);
        else return prev.multipliedBy(x.pow(curr)).modulo(m);
    }, new BigNumber(1));
    return result;
}

const millerRabin = (p, k, currK = 1) => {
    if (k === currK) return true;
    let d = p.minus(1);
    let s = 0;
    while (d.modulo(2) == 0) {
        d = d.dividedBy(2);
        s++;
    }
    const x = getRandom(new BigNumber(1), p);
    if (getGcd(p, x) == 1) {
        let result = false;
        if (hornersMethod(x, d, p) != 1 && hornersMethod(x, d, p).minus(p) != -1) {
            let xr;
            for (let r = 1; r < s; r++) {
                if (r === 1) xr = hornersMethod(x, d.multipliedBy(2), p);
                else xr = xr.pow(2).modulo(p);
                if (xr.minus(p) == -1) {
                    result = true;
                    break;
                }
                else if (xr == 1) {
                    result = false;
                    break;
                }
            }
        } else result = true;
        if (result === true) return millerRabin(p, k, currK + 1);
        else return false;
    } else return false;
}

const getPrime = (n0, n1, k) => {
    const x = getRandom(n0, n1);
    if (x.modulo(2) == 0) m0 = x.plus(1);
    else m0 = x;
    let i = 0, temp = m0;
    while (i != n1.minus(m0).dividedBy(2).integerValue(BigNumber.ROUND_DOWN).plus(1)) {
        if (checkPrime(temp) && millerRabin(temp, k)) return temp;
        i += 1;
        temp = m0.plus(i * 2);
    }
    return false;
}

const getPrimeWithUserRange = () => { 
    const n0 = new BigNumber(rl.question('Enter first number: '));
    const n1 = new BigNumber(rl.question('Enter second number: '));
    const k = Number(rl.question('Enter k: '));
    return [n0, n1, k];
}

const generatePrimePairs = (n0, n1, k) => {
    return [
        {
            p: getPrime(...getPrimeWithUserRange()),
            q: getPrime(...getPrimeWithUserRange())
        },
        {
            p: getPrime(...getPrimeWithUserRange()),
            q: getPrime(...getPrimeWithUserRange())
        }
    ]
}

const generateKeyPair = ({ p, q }) => {
    const n = p.multipliedBy(q);
    const euler = p.minus(1).multipliedBy(q.minus(1));
    const e = new BigNumber(2).pow(16).plus(1);
    const d = euclideanAlgorithm(euler, e);
    
    return {
        closed: { d, p, q },
        opened: { n, e }
    }
}

const encrypt = (m, e, n) => hornersMethod(m, e, n);

const decrypt = (c, d, n) => hornersMethod(c, d, n);

const sign = (m, d, n) => {
    const s = hornersMethod(m, d, n);
    return { m, s };
}

const verify = (s, e, n) => hornersMethod(s, e, n);

const sendKey = (k, e1, d, n, n1) => {
    const { s } = sign(k, d, n);
    const s1 = encrypt(s, e1, n1);
    const k1 = encrypt(k, e1, n1);

    return { s1, k1 };
}

const receiveKey = (d1, k1, s1, n1, e, n) => {
    const k = decrypt(k1, d1, n1);
    const s = decrypt(s1, d1, n1);
    const verification = verify(s, e, n);
    console.log("K: ", verification.toFixed(), "M: ", k.toFixed());
    return { verification, k };
}
const [first, second] = generatePrimePairs();
const firstKeys = generateKeyPair(first);
const secondKeys = generateKeyPair(second);

const message = getRandom(new BigNumber(0), new BigNumber(firstKeys.opened.n));
const mess = sendKey(message, secondKeys.opened.e, firstKeys.closed.d, firstKeys.opened.n, secondKeys.opened.n);
receiveKey(secondKeys.closed.d, mess.k1, mess.s1, secondKeys.opened.n, firstKeys.opened.e, firstKeys.opened.n);
