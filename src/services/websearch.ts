import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

interface SearchResult {
  title: string;
  link?: string;
  snippet: string;
}

export async function getGoogleSearchResults(query: string, pages: number = 1): Promise<SearchResult[]> {
  const results: SearchResult[] = [];
  let searchUrl: string = `https://www.google.com/search?q=${encodeURIComponent(query)}`;

  for (let i = 0; i < pages; i++) {
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });
    const data = await response.text(); // fetch의 결과를 text로 읽어옴

    const $ = cheerio.load(data);
    console.log('google데이터',$)
    // 검색 결과 추출
    $('div.g').each((index : number, element : any ) => {
      const title: string = $(element).find('h3').text();
      const link: string | undefined = $(element).find('a').attr('href');
      const snippet: string = $(element).find('.IsZvec').text();
      if (link) { // 링크가 존재할 때만 결과에 추가
        results.push({ title, link, snippet });
      }
    });

    // 다음 페이지의 URL 찾기
    const nextPageLink: string | undefined = $('a#pnnext').attr('href');
    if (!nextPageLink) {
      break; // 다음 페이지가 없으면 종료
    }
    searchUrl = `https://www.google.com${nextPageLink}`;
  }

  return results;
}

export async function getNaverSearchResults(query: string, pages: number = 1): Promise<SearchResult[]> {
  const results: SearchResult[] = [];
  let searchUrl: string = `https://search.naver.com/search.naver?query=${encodeURIComponent(query)}`;

  for (let i = 0; i < pages; i++) {
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });
    const data = await response.text(); // fetch의 결과를 text로 읽어옴
    const $ = cheerio.load(data);

    // 검색 결과 추출
    $('a mark').each((index: number, element: any) => {
      console.log('엘리먼트', element)
      // console.log('크롤링결과////////////', $('a mark').closest('span').text())
      const title: string  = element.children[0].data;
      const link: string | undefined = $(element).find('a').attr('href');
      if (link) { // 링크가 존재할 때만 결과에 추가
        results.push({ title, link, snippet: ''});
      }
    });

    // 다음 페이지의 URL 찾기
    const nextPageLink: string | undefined = $('a#pnnext').attr('href');
    if (!nextPageLink) {
      break; // 다음 페이지가 없으면 종료
    }
    searchUrl = `https://www.naver.com${nextPageLink}`;
  }

  return results;
}

