#include <iostream>
#include <iostream>
#include <fstream>
#include <sstream>
#include <vector>
#include <numeric>
#include <cmath>
#include <random>
#include <cstdlib>
#include <string>
#include <algorithm>
#include <iterator>
#include <thread>

#include "coil.hpp"
#include "individual.hpp"

using namespace std;

int main(int argc, char **argv)
{
    if (argc < 2)
    {
        cout << "please input argument!!" << endl;
        cout << "genCoil ./keywordList.txt ./wordList.txt 40000 0" << endl;
        return 1;
    }

    // 入力する単語データ
    vector<string> keywordList;
    vector<string> wordList;

    // ファイル読み込み
    ifstream ifstream;
    string line;

    ifstream.open(argv[1]);
    while (getline(ifstream, line))
    {
        keywordList.push_back(line);
    }
    ifstream.close();

    ifstream.open(argv[2]);
    while (getline(ifstream, line))
    {
        wordList.push_back(line);
    }
    ifstream.close();

    // キーワードの個数
    int keywordListLength = keywordList.size();

    // 乱数の用意
    std::random_device rdev{}; //乱数生成器を生成
    std::mt19937 mt(rdev());   //メルセンヌ・ツイスタ生成器を使用

    // 局所集団
    vector<individual> group;

    // Step.1 全探索空間から1個体をランダムに取り出し、これを初期局所集団とする。
    // cout << "step.1" << endl;
    group.push_back(individual(keywordListLength));

    // 指定回数変化がなければ終了
    int noChangeCount = 0;
    int lastScore = 0;

    // この世代数変化がなければ終了
    int maxGen = atoi(argv[3]);

    // 重複を許可する回数
    int coilWordDup = atoi(argv[4]);

    // 世代ループ
    for (int g = 0;; g++)
    {
        // Step.2 個体数が4未満であれば、全探索空間から1個体をランダムに取り出し、これを局所集団に追加する。
        // cout << "step.2 " << group.size()<< endl;
        if (group.size() == 1)
            group.push_back(individual(keywordListLength));

        // Step.3.1 局所集団から2個体（親）をランダムに取り出し(シャッフルして二つ持ってくる)
        // cout << "step.3.1" << endl;
        shuffle(begin(group), end(group), mt);
        vector<individual> parent(2, individual(0));
        vector<individual> child(2, individual(0));
        copy(group.begin(), group.begin() + 2, parent.begin());
        copy(group.begin(), group.begin() + 2, child.begin());
        group.clear();

        // Step.3.2 子供でランダムな多点交叉を行なう
        // cout << "step.3.2" << endl;
        {
            // カット個所数
            int cutPosConut = mt() % ((keywordListLength - 1) / 2) * 2;
            vector<int> cutPos;

            while (cutPos.size() != cutPosConut)
            {
                int tempPos = mt() % (keywordListLength - 1);
                if (!any_of(cutPos.begin(), cutPos.end(), bind2nd(equal_to<int>(), tempPos)))
                    cutPos.push_back(tempPos);
            }

            sort(cutPos.begin(), cutPos.end());

            for (int i = 0; i < cutPos.size(); i += 2)
            {
                int cutStart = cutPos[i];
                int cutEnd = cutPos[i + 1];
                for (int i = cutStart; i <= cutEnd; i++)
                {
                    iter_swap(child[0].gene.begin() + i, child[1].gene.begin() + i);
                }
            }
        }
        // Step.4 交叉によって生成された2個体(子)のうち1個体をランダムに選択し、ランダムな数と位置において突然変異を行なう。
        // cout << "step.4" << endl;
        {
            int targetChild = mt() % 2;
            int mutePosConut = mt() % (keywordListLength - 1);
            vector<int> mutePos;

            while (mutePos.size() != mutePosConut)
            {
                int tempPos = mt() % (keywordListLength - 1);
                if (!any_of(mutePos.begin(), mutePos.end(), bind2nd(equal_to<int>(), tempPos)))
                    mutePos.push_back(tempPos);
            }
            for (auto &pos : mutePos)
            {
                child[targetChild].gene[pos] = !child[targetChild].gene[pos];
            }
        }

        // Step.5 親子計4個体を評価し、上記の方法で選択された1～3個体を局所集団に戻す。
        // 現世代の最高スコアと遺伝子
        // cout << "step.5" << endl;
        individual top(0);
        {
            // 評価
            vector<thread> threads;
            threads.emplace_back([&]() {
                parent[0].calcScore(keywordList, wordList, coilWordDup);
            });
            threads.emplace_back([&]() {
                parent[1].calcScore(keywordList, wordList, coilWordDup);
            });
            threads.emplace_back([&]() {
                child[0].calcScore(keywordList, wordList, coilWordDup);
            });
            threads.emplace_back([&]() {
                child[1].calcScore(keywordList, wordList, coilWordDup);
            });
            for (auto &t : threads)
            {
                t.join();
            }
            // parent[0].calcScore(keywordList, wordList, coilWordDup);
            // parent[1].calcScore(keywordList, wordList, coilWordDup);
            // child[0].calcScore(keywordList, wordList, coilWordDup);
            // child[1].calcScore(keywordList, wordList, coilWordDup);

            if (max(parent[0].score, parent[1].score) <= min(child[0].score, child[1].score))
            {
                // cout << "Case:A" << endl;
                // CaseA 子2個体がともに親の2個体より良かった場合は、子2個体及び適応度の良かった方の親個体計3個体が局所集団に戻る。
                group.push_back(child[0]);
                group.push_back(child[1]);
                group.push_back(parent[0].score >= parent[1].score ? parent[0] : parent[1]);

                top = child[child[0].score > child[1].score ? 0 : 1];
            }
            else if (max(child[0].score, child[1].score) <= min(parent[0].score, parent[1].score))
            {
                // cout << "Case:B" << endl;
                // CaseB 子2個体がともに親の2個体より悪かった場合は、親2個体のうち良かった方のみが局所集団に戻る。
                group.push_back(parent[0].score >= parent[1].score ? parent[0] : parent[1]);

                top = parent[parent[0].score >= parent[1].score ? 0 : 1];
            }
            else if (parent[0].score >= max(child[0].score, child[1].score) || parent[1].score >= max(child[0].score, child[1].score))
            {
                // cout << "Case:C" << endl;
                // CaseC 親2個体のうちどちらか一方のみが子2個体より良かった場合は、親2個体のうち良かった方と子2個体のうち良かった方が局所集団に戻る。
                group.push_back(child[0].score >= child[1].score ? child[0] : child[1]);
                group.push_back(parent[0].score >= parent[1].score ? parent[0] : parent[1]);

                top = parent[parent[0].score >= parent[1].score ? 0 : 1];
            }
            else if (child[0].score >= max(parent[0].score, parent[1].score) || child[1].score >= max(parent[0].score, parent[1].score))
            {
                // cout << "Case:D" << endl;
                // CaseD 子2個体のうちどちらか一方のみが親2個体より良かった場合は、子2個体のうち良かった方のみが局所集団に戻り、全探索空間からランダムに1個体選んで局所集団に追加する。
                group.push_back(child[0].score >= child[1].score ? child[0] : child[1]);
                group.push_back(individual(keywordListLength));

                top = child[child[0].score > child[1].score ? 0 : 1];
            }
        }

        // 現世代で一番良い個体のスコアを表示
        // cout << g << ":" << top.score << endl;

        // 一定回数変化がなければ終了
        if (lastScore == top.score)
        {
            noChangeCount++;
        }
        else
        {
            noChangeCount = 0;
            lastScore = top.score;
        }
        if (noChangeCount >= maxGen)
        {
            // 終了処理
            vector<string> lastCoilKeywords;
            for (int i = 0; i < top.gene.size(); i++)
            {
                if (top.gene[i])
                {
                    lastCoilKeywords.push_back(keywordList[i]);
                }
            }
            vector<coil> lastCoils = genCoil(lastCoilKeywords, wordList, coilWordDup);
            cout << "キーワード数" << lastCoils.size()<<endl;
            for (auto &coil : lastCoils)
            {
                cout << coil.keyword << endl;
                for (auto &word : coil.words)
                {
                    cout << word << ",";
                }
                cout << endl;
            }
            cout << top.score << "/" << wordList.size() << endl;
            break;
        }
    }

    return 0;
}