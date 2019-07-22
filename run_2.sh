#!/bin/bash
cd dataset
CAT="家庭・暮らし"
for LV in "350点以上の単語"; do
        echo ${LV}
            node ./outkeywordlist.js -c ${CAT} -l ${LV} >> ${LV}_${CAT}_keywordlist.txt
            node ./outwordlist.js -c ${CAT} -l ${LV} >> ${LV}_${CAT}_wordlist.txt
done
for DUP in "0" "1" "2";do
    for LV in "350点以上の単語"; do
        echo ${LV}
            ../genCoil.exe ${LV}_${CAT}_keywordlist.txt ${LV}_${CAT}_wordlist.txt 4000 ${DUP}>> result/${LV}_${CAT}_重複${DUP}回.txt
    done
done