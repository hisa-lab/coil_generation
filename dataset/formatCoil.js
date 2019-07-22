'use strict';
// let fs = new ActiveXObject("Scripting.FileSystemObject");
// let file = fs.OpenTextFile("./result/高校1年以上の水準_家庭・暮らし_重複0回.txt");

// let fs2 = new ActiveXObject("Scripting.FileSystemObject");
// let file2 = fs.OpenTextFile("./高校1年以上の水準_家庭・暮らし_wordlist.txt");

const program = require("commander");
const fs = require("fs");
let levels = [
    {
        en: "Middle_school",
        ja: "中学",
    },
    {
        en: "High_school_1",
        ja: "高校1年",
    },
    {
        en: "High_school_2",
        ja: "高校2年",
    },
    {
        en: "High_school_3",
        ja: "高校3年",
    },
    {
        en: "University",
        ja: "大学",
    },
    {
        en: "Graduate",
        ja: "大学院",
    }
];
let categorys = [
    {
        en: "Culture",
        ja: "文化・芸術"
    },
    {
        en: "Sports",
        ja: "スポーツ"
    },
    {
        en: "Recreation",
        ja: "レクリエーション"
    },
    {
        en: "Politice",
        ja: "政治"
    },
    {
        en: "Cuisine",
        ja: "料理・食事"
    },
    {
        en: "Home",
        ja: "家庭・暮らし"
    },
    {
        en: "Business",
        ja: "ビジネス"
    },
    {
        en: "Science",
        ja: "科学・技術"
    },
    {
        en: "Education",
        ja: "教育・学習"
    },
    {
        en: "Traffic",
        ja: "交通"
    },
    {
        en: "Health",
        ja: "健康・医学"
    },
    {
        en: "Media",
        ja: "メディア"
    },
    {
        en: "Other",
        ja: "その他"
    }
];

program.parse(process.argv);
const filePath = program.args[0];
let filename = program.args[0];
let cut_level = program.args[1].split('以上');
let set_level = cut_level[0];
let set_category = program.args[2];
let sort_category;
let sort_level;
console.log(filePath);
let result = fs.readFileSync(filePath, "utf8");
result = result.split('\r\n');
for (const cate of categorys) {
    if (cate.ja === set_category) sort_category = cate.en;
}
for (const cate of levels) {
    if (cate.ja === set_level) sort_level = cate.en;
}

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
    coilword: [],
    level: sort_level,
    category: sort_category
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
        // console.log(coil);

        coils.push(coil);
        coil = {
            keyword: "",
            coilword: [],
            level: sort_level,
            category: sort_category
        };
    }
}
if (coils.length > 0) {

    let resultname = filename.split(/[\/\.]/);
    console.log("filename", resultname);
    fs.appendFileSync(`./json/coils.json`, JSON.stringify(coils, null, '    '));
}
