#include <algorithm>
#include <string>
#include <vector>
#include <unordered_map>
#include <map>
#include <set>
#include <functional>
using namespace std;

class coil
{
  public:
    string keyword;
    vector<string> words;
};

// keywords キーワードになる単語リスト
// words コイルを構成単語のリスト
// 重複許可数
vector<coil> genCoil(vector<string> keywords, vector<string> words, int dupCount);