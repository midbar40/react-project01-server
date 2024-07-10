import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

interface GoogleSearchResult {
  title: string;
  link?: string;
  snippet: string;
}

interface NaverSearchResult {
 type : 'popular' | 'news' | 'list' | 'question' | 'powerlink' | 'mainbanner' | 'brandContent'
}

interface PopularSearchResult extends NaverSearchResult {
  title: string;
  link?: string;
}

interface NewsSearchResult extends NaverSearchResult {
  title: string;
  link?: string;
}

interface ListSearchResult extends NaverSearchResult {
  title: string;
  link?: string;
}

interface QuestionSearchResult extends NaverSearchResult {
  title: string;
  link?: string;
}

interface PowerlinkSearchResult extends NaverSearchResult {
  title: string;
  link?: string;
}

interface MainbannerSearchResult extends NaverSearchResult {
  title: string;
  link?: string;
}

interface BrandContentSearchResult extends NaverSearchResult {
  title: string;
  link?: string;
}

export async function getGoogleSearchResults(query: string, query2: string, pages: number = 3): Promise<GoogleSearchResult[]> {
  const results: GoogleSearchResult[] = [];
  let searchUrl: string = `https://www.google.com/search?q=${encodeURIComponent(query) + encodeURIComponent(query2)}`;

  for (let i = 0; i < pages; i++) {
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });
    const data = await response.text(); // fetch의 결과를 text로 읽어옴

    const $ = cheerio.load(data);
    // 검색 결과 추출
    $('div.g').each((index: number, element: any) => {
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

type CombinedSearchResult = PopularSearchResult | NewsSearchResult | ListSearchResult | QuestionSearchResult | PowerlinkSearchResult | MainbannerSearchResult | BrandContentSearchResult;


export async function getNaverSearchResults(query: string, query2: string, pages: number = 3): Promise<NaverSearchResult[]> {
  const results: CombinedSearchResult[] = [];
  let searchUrl: string = `https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=0&ie=utf8&query=${encodeURIComponent(query) + encodeURIComponent(query2)}`;

  for (let i = 0; i < pages; i++) {
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });
    const data = await response.text(); // fetch의 결과를 text로 읽어옴
    const $ = cheerio.load(data);

    // 인기글
    $('div.title_area').each((index: number, element: any) => {
      const title: string = $(element).text() 
      const link: string | undefined = $(element).find('a').attr('href')
      if (link) {
        results.push({ type : 'popular',title, link });
      }
    })
    // 뉴스
    $('a.news_tit').each((index: number, element: any)  => {
      const title: string = $(element).text()
      const link: string | undefined = $(element).attr('href')
      if (link) {
        results.push({ type:'news', title, link });
      }
    })
    // 리스트글 : 검색결과 더보기 
    $('div.total_tit').each((index: number, element: any)  => {
      const title: string = $(element).text() 
      const link: string | undefined = $(element).find('a').attr('href')
      if (link) {
        results.push({ type:'list', title, link });
      }
    })
    // 지식인
    $('div.question_group').each((index: number, element: any)  => {
      const title: string = $(element).text() 
      const link: string | undefined = $(element).find('a').attr('href')
      if (link) {
        results.push({ type: 'question', title, link });
      }
    })
    // 파워링크
    $('a.lnk_head').each((index: number, element: any)  => {
      const title: string = $(element).text()
      const link: string | undefined = $(element).attr('href')
      if (link) {
        results.push({ type:'powerlink', title, link });
      }
    })
    // 메인배너, 이미지,동영상,최상단
    $('a.main_title').each((index: number, element: any)  => {
      const title: string = $(element).text()
      const link: string | undefined = $(element).attr('href')
      if (link) {
        results.push({ type:'mainbanner', title, link });
      }
    })
    // 브랜드콘텐츠 : 쿼리가 하나일 때만 검색결과가 존재한다
    $('a.fds-comps-right-image-text-title').each((index: number, element: any)  => {
      const title: string = $(element).text()
      const link: string | undefined = $(element).attr('href')
      if (link) {
        results.push({ type:'brandContent', title, link });
      }
    })

    console.log('네이버 크롤링결과', results)
    // 다음 페이지의 URL 찾기
    const nextPageLink: string | undefined = $('div.sc_page_inner').find('a').attr('href');
    if (!nextPageLink) {
      break; // 다음 페이지가 없으면 종료
    }
    searchUrl = `https://search.naver.com/search.naver${nextPageLink}`;
  }

  return results;
}

