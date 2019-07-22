'use strict';
const ALLALPHABET = 'abcdefghijklmnopqrstuvwxyz';

// json, レベル(完全一致)配列, カテゴリ(完全一致)配列
module.exports = (json, lvs, cats) => {
    // ファイルの読み出し
    let wordlist = JSON.parse(json);

    // 対象とするカテゴリの単語を取得
    wordlist = wordlist.filter(word => {
        for (const cat of cats) {
            if (word.kategori === cat) return true;
        }
        return false;
    });

    // 対象とする難易度の単語を取得
    wordlist = wordlist.filter(word => {
        for (const lv of lvs) {
            // console.log(word.lv[3], word.eng);
            // if (word.lv.length > 3) {
            //     console.log("length: ", word.lv.length);
            if (word.lv[2].content === lv) return true;
            //         }
        }
        return false;
    });

    // 英単語以外の情報を削除し、英単語を小文字に
    wordlist = wordlist.map(x => x.eng.toLowerCase());

    //重複削除
    wordlist = wordlist.filter((x, i, self) => self.indexOf(x) === i);

    //空白を含む単語を削除
    wordlist = wordlist.filter(word => word.indexOf(' ') < 0);

    // 作れる可能性がある単語リストを生成
    let keyWordList = [];
    {
        // 各単語の頭文字の分布を得る
        let alphabetMapHead = {};
        let wordCount = wordlist.length;
        for (const itr of wordlist) {
            alphabetMapHead[itr[0]] ? alphabetMapHead[itr[0]]++ : alphabetMapHead[itr[0]] = 1;
        }
        let notFindAlphabet = [];
        for (const key of ALLALPHABET) {
            if (!alphabetMapHead[key]) {
                notFindAlphabet.push(key);
            }
        }
        keyWordList = wordlist.filter(word => {
            for (const alp of word) {
                if (notFindAlphabet.indexOf(alp) !== -1) return false;
            }
            return true;
        });
    }

    // 使えない単語を省く
    {
        // キーワードのアルファベットの分布を得る
        let alphabetMap = {};
        for (const alp of ALLALPHABET) {
            alphabetMap[alp] = 0;
        }
        for (const countWord of keyWordList) {
            for (const alphabet of countWord) {
                alphabetMap[alphabet]++;
            }
        }
        for (const key in alphabetMap) {
            if (alphabetMap[key] > 0) continue;
            wordlist = wordlist.filter(word => {
                return word[0] !== key;
            });
        }
    }
    return {
        wordlist: wordlist,
        keyWordList: keyWordList
    };
};
