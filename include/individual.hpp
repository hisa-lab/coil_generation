#include <vector>
#include <random>

using namespace std;

class individual
{
  public:
    vector<bool> gene;
    int score;
    individual(int keyWordListLength);
    void calcScore(vector<string> keywordList, vector<string> words, int dupCount);
};