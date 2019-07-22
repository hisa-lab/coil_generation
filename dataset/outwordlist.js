'use strict';
const crypto = require('crypto');
const fs = require('fs');
const _ = require('underscore');
const program = require("commander");
const coilWordLoader = require('./loadData');
const ALLALPHABET = 'abcdefghijklmnopqrstuvwxyz';

// コマンドライン引数の読み出し
program
    .option("-l, --lvs <items>", "LV Names.", value => (value || []).split(","), [])
    .option("-c, --cats <items>", "Category Names.", value => (value || []).split(","), [])
    .option('-q, --quiet', 'Quiet Mode')
    .parse(process.argv);

if (process.argv.length < 3) {
    program.help();
}


let { wordlist, keyWordList } = coilWordLoader(fs.readFileSync('./words.json'), program.lvs, program.cats);

for (const word of wordlist) {
    console.log(word);
}