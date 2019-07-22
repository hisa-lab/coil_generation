#include "individual.hpp"
#include "coil.hpp"
#include <unordered_map>

individual::individual(int keyWordListLength)
{

    // 乱数の用意
    std::random_device rdev{}; //乱数生成器を生成
    std::mt19937 mt(rdev());   //メルセンヌ・ツイスタ生成器を使用
    for (int i = 0; i < keyWordListLength; i++)
    {
        this->gene.push_back(0 == (mt() % 2));
    }
}
// 評価用関数
// スコアはコイルに使えた単語数
void individual::calcScore(vector<string> keywordList, vector<string> words, int dupCount)
{
    vector<string> coilKeywords;
    for (int i = 0; i < this->gene.size(); i++)
    {
        if (this->gene[i])
        {
            coilKeywords.push_back(keywordList[i]);
        }
    }
    vector<coil> coils = genCoil(coilKeywords, words, dupCount);
    vector<string> usedWords;
    for (auto &c : coils)
    {
        usedWords.push_back(c.keyword);
        usedWords.insert(usedWords.end(), c.words.begin(), c.words.end());
    }
    sort(usedWords.begin(), usedWords.end());
    usedWords.erase(unique(usedWords.begin(), usedWords.end()), usedWords.end());
    this->score = usedWords.size();
}
//