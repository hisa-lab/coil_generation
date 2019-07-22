'use strict';
// let fs = new ActiveXObject("Scripting.FileSystemObject");
// let file = fs.OpenTextFile("./result/高校1年以上の水準_家庭・暮らし_重複0回.txt");

// let fs2 = new ActiveXObject("Scripting.FileSystemObject");
// let file2 = fs.OpenTextFile("./高校1年以上の水準_家庭・暮らし_wordlist.txt");

const program = require("commander");
const fs = require("fs");
program.parse(process.argv);
const filePath = program.args[0];
let filename = program.args[0];

let result = fs.readFileSync(filePath, "utf8");
result = result.split('\r\n');

console.log("=(" + result[result.length - 2] + ")")
//console.log(result);
result.pop();
result.pop();
result.shift();

// console.log(wordlist);
// console.log(result);
let pos = 0;
let coils = [];
let coil = {
    keyword: "",
    coilword: []
};

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
        coil.coilword = list;
        coils.push(coil);
        // console.log("coils*  ", coils);
        coil = {
            keyword: "",
            coilword: []
        };
    }
}
let resultname = filename.split('.');
fs.writeFileSync(`./${resultname[0]}.json`, JSON.stringify(coils, null, '    '));