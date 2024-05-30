const cheerio = require('cheerio');

async function getGoogleSearchResults(query, pages = 1) {
  let results = [];
  let searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;

  for (let i = 0; i < pages; i++) {
    const { data } = await fetch.get(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });

    const $ = cheerio.load(data);

    // 검색 결과 추출
    $('div.g').each((index, element) => {
      const title = $(element).find('h3').text();
      const link = $(element).find('a').attr('href');
      const snippet = $(element).find('.IsZvec').text();
      results.push({ title, link, snippet });
    });

    // 다음 페이지의 URL 찾기
    const nextPageLink = $('a#pnnext').attr('href');
    if (!nextPageLink) {
      break; // 다음 페이지가 없으면 종료
    }
    searchUrl = `https://www.google.com${nextPageLink}`;
  }

  return results;
}

// 사용 예시: 첫 3페이지의 결과 가져오기
getGoogleSearchResults('개발자', 15)
  .then(results => console.log(results))
  .catch(err => console.error(err));
