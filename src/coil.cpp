#include "coil.hpp"

// keywords キーワードになる単語リスト
// words コイルを構成単語のリスト
// 重複許可数
vector<coil> genCoil(vector<string> keywords, vector<string> words, int dupCount)
{

	// 各単語の使用回数
	unordered_map<std::string, int> usedWords;
	for (auto &word : words)
	{
		usedWords[word] = 0;
	}
	//各キーワードの使用回数
	unordered_map<std::string, int> usedKeyWords;
	for (auto &keyword : keywords)
	{
		usedKeyWords[keyword] = 0;
	}
	// 生成済みコイル入れ
	vector<coil> coils;
	// 一度重複なしでcoil生成してから重複許可
	int i = 0;
	do
	{
		std::sort(words.begin(),
				  words.end(),
				  [&](const string &x, const string &y) {
					  return usedWords[x] < usedWords[y];
				  });

		for (auto &keyword : keywords)
		{
			int dup_size = 0;
			//同じキーワードが使用されないように１回使用されていたらスキップ
			if (usedKeyWords[keyword] > 0)
				continue;
			coil newcoil;
			newcoil.keyword = keyword;
			for (auto &alphabet : keyword)
			{
				for (auto &word : words)
				{
					if (alphabet == word[0])
					{
						// 各アルファベットで始まる単語を探す
						// その単語がキーワードだったらスキップ
						if (keyword == word)
							continue;
						// その単語をこのキーワードのコイルで一度使っていたらスキップ
						if (any_of(newcoil.words.begin(), newcoil.words.end(), bind2nd(equal_to<string>(), word)))
							continue;
						// 過去にその単語が規定回数以上利用されていたらスキップ
						if (usedWords[word] > i)
							continue;
						// 問題なければコイルに追加
						newcoil.words.push_back(word);
						for (auto &word : newcoil.words)
						{
							if (usedWords[word] > 0)
							{
								dup_size++;
							}
						}
						break;
					}
				}
			}
			// コイルが成立したら、コイルを構成する単語とキーワードをリストから削除
			if (keyword.length() == newcoil.words.size() && newcoil.words.size() > dup_size)
			{
				for (auto &word : newcoil.words)
				{
					usedWords[word]++;
				}
				usedWords[newcoil.keyword]++;
				usedKeyWords[newcoil.keyword]++;
				coils.push_back(newcoil);
			}
		}
		i++;
	} while (i <= dupCount);

	return coils;
}
