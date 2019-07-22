#!/bin/bash
cd dataset
CAT="家庭・暮らし"
cd dataset
for DUP in "0" "1" "2";do
    for LV in "中学以上の水準" "高校1年以上の水準" "高校2年以上の水準" "高校3年以上の水準" "大学以上の水準" "大学院以上の水準" "高校1年以上の水準,高校2年以上の水準,高校3年以上の水準"; do
        echo ${LV}
        node ./dupword_count.js ./result/${LV}_${CAT}_重複${DUP}回.txt ${LV}_${CAT}_wordlist.txt >> ./result_count/${LV}_${CAT}_重複${DUP}回_data.txt
    done
done
#----------------------------------------------------------------------------------------------------------------------------
CAT="その他,文化・芸術,スポーツ,レクリエーション,政治,料理・食事,家庭・暮らし,ビジネス,科学・技術,教育・学習,交通,健康・医学,メディア"
LV="中学以上の水準"

for DUP in "0" "1" "2";do
echo ${LV}
node ./dupword_count.js ./result/${LV}_${CAT}_重複${DUP}回.txt ${LV}_${CAT}_wordlist.txt >> ./result_count/${LV}_${CAT}_重複${DUP}回_data.txt
done