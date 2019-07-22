#!/bin/bash
make
cd dataset
for CAT in "文化・芸術" "スポーツ" "レクリエーション" "政治" "料理・食事" "家庭・暮らし" "ビジネス" "科学・技術" "教育・学習" "交通" "健康・医学" "メディア";do
    for LV in "中学以上の水準" "高校1年以上の水準" "高校2年以上の水準" "高校3年以上の水準" "大学以上の水準" "大学院以上の水準"; do
            echo ${LV}
                mkdir -p ${LV}_${CAT}/data
                mkdir ${LV}_${CAT}/result
                node ./outkeywordlist.js -c ${CAT} -l ${LV} >> ./${LV}_${CAT}/data/${LV}_${CAT}_keywordlist.txt
                node ./outwordlist.js -c ${CAT} -l ${LV} >> ./${LV}_${CAT}/data/${LV}_${CAT}_wordlist.txt
    done
    for DUP in "0" "1" "2";do
        for LV in "中学以上の水準" "高校1年以上の水準" "高校2年以上の水準" "高校3年以上の水準" "大学以上の水準" "大学院以上の水準"; do
            echo ${LV}
                ../genCoil.exe ./${LV}_${CAT}/data/${LV}_${CAT}_keywordlist.txt ./${LV}_${CAT}/data/${LV}_${CAT}_wordlist.txt 40000 ${DUP}>> ./${LV}_${CAT}/result/${LV}_${CAT}_重複${DUP}回.txt
                node ./result/formatCoil.js ./${LV}_${CAT}/result/${LV}_${CAT}_重複${DUP}回.txt
        done
    done
done
#----------------------------------------------------------------------------------------------------------------------------
# CAT="その他,文化・芸術,スポーツ,レクリエーション,政治,料理・食事,家庭・暮らし,ビジネス,科学・技術,教育・学習,交通,健康・医学,メディア"
# LV="中学以上の水準"
# echo ${LV}
# node ./outkeywordlist.js -c ${CAT} -l ${LV} >> ${LV}_${CAT}_keywordlist.txt
# node ./outwordlist.js -c ${CAT} -l ${LV} >> ${LV}_${CAT}_wordlist.txt

# for DUP in "0" "1" "2";do
# echo ${LV}
# ../genCoil.exe ${LV}_${CAT}_keywordlist.txt ${LV}_${CAT}_wordlist.txt 40000 ${DUP}>> result/${LV}_${CAT}_重複${DUP}回.txt
# done