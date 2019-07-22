'use strict';
// let fs = new ActiveXObject("Scripting.FileSystemObject");
// let file = fs.OpenTextFile("./result/高校1年以上の水準_家庭・暮らし_重複0回.txt");

// let fs2 = new ActiveXObject("Scripting.FileSystemObject");
// let file2 = fs.OpenTextFile("./高校1年以上の水準_家庭・暮らし_wordlist.txt");

const program = require("commander");
const fs = require("fs");
program.parse(process.argv);
const filePath = program.args[0];
const filePath2 = program.args[1];

let result = fs.readFileSync(filePath, "utf8");
result = result.split('\r\n');
let wordlist = fs.readFileSync(filePath2, "utf8");
wordlist = wordlist.split('\n');
console.log("=(" + result[result.length - 2] + ")")
//console.log(result);
result.pop();
result.pop();
result.shift();
wordlist.pop();
// console.log(wordlist);
// console.log(result);
let s = 0;
const ALLALPHABET = 'abcdefghijklmnopqrstuvwxyz';
let pos = 0;
let coils = [];
let coil = {
    keyword: "",
    coil: []
};
let coilword = [];
let tyoufuku = [];
let keywordcount = [];
let usecoilwords = [];
let usetyoufuku = [];
let alphabet_distribution = {};
let coilused_alphabet_distribution = {};
for (let index = 0; index < result.length; index++) {

    if (index % 2 === 0) {
        coil.keyword = result[index];
    }
    else if (index % 2 === 1) {
        let list = result[index];
        // console.log(list);
        list = list.split(',');
        list.pop();
        // console.log(list);
        coil.coil = list;
        coils.push(coil);
        // console.log("coils*  ", coils);
        coil = {
            keyword: "",
            coil: []
        };
    }
}

//console.log(coils);
for (const c of coils) {
    // if (c.coil.length > 0) s += c.coil.length + 1;
    if (c.coil.length > 0) {
        coilword.push(...c.coil);
        coilword.push(c.keyword);
        keywordcount.push(c.keyword);
        usecoilwords.push(...c.coil);


    }
}
for (const word of usecoilwords) {
    tyoufuku[word] ? tyoufuku[word]++ : tyoufuku[word] = 1;
    if (tyoufuku[word] >= 2) usetyoufuku.push(word);
}
//ソート後のアルファベット分布
for (const alp of ALLALPHABET) {
    alphabet_distribution[alp] = 0;
}
for (const itr of wordlist) {
    alphabet_distribution[itr[0]]++;
}
//使用できた単語のアルファベット分布
for (const alp of ALLALPHABET) {
    coilused_alphabet_distribution[alp] = 0;
}
for (const itr of coilword) {
    coilused_alphabet_distribution[itr[0]]++;
}
coilword = coilword.filter((x, i, self) => self.indexOf(x) === i);
s = coilword.length;
usetyoufuku = usetyoufuku.filter((x, i, self) => self.indexOf(x) === i);
let keys = [];
let values = [];
let dupcount_arr = [];
for (var key in tyoufuku) {
    let dupword_word = {
        word: "",
        count: 0
    }
    dupword_word.count = tyoufuku[key];
    dupword_word.word = key;
    dupcount_arr.push(dupword_word);
}
dupcount_arr.sort(function (a, b) {
    if (a.count < b.count) return -1;
    if (a.count > b.count) return 1;
    return 0;
});
let dup_1 = 0;
let dup_2 = 0;
for (const word of dupcount_arr) {
    if (word.count == 2) dup_1++;
    if (word.count == 3) dup_2++;
}
let keyword_length_sum = 0;
for (const keyword of keywordcount) {
    keyword_length_sum += keyword.length;
}
let keyword_ave = 0;
keyword_ave = keyword_length_sum / keywordcount.length;
console.log("ソート後の単語 ", wordlist);
console.log("コイルワード数");
console.log(wordlist.length);
console.log("使用した単語 ", coilword);
// console.log(`${score}/${wordlist.length}`);
console.log("キーワード数 ", keywordcount.length);
console.log("キーワード一覧 ", keywordcount);
console.log("キーワードの長さ平均: ", keyword_ave);
console.log("単語重複回数 ", tyoufuku, tyoufuku.length);
console.log("単語使用回数一覧");
console.log(dupcount_arr, dupcount_arr.length);
console.log("1回重複単語数");
console.log(dup_1);
console.log("2回重複単語数");
console.log(dup_2);
console.log("重複に使用した単語数", usetyoufuku.length);
console.log("重複に使用した単語", usetyoufuku);
console.log("アルファベット分布", alphabet_distribution);
console.log("coil生成に使用した単語のアルファベット分布", coilused_alphabet_distribution);
console.log(JSON.stringify(coils));
console.log("実際に利用されたコイルワード数");
console.log(usecoilwords.length);