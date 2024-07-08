import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

interface GoogleSearchResult {
  title: string;
  link?: string;
  snippet: string;
}

interface NaverSearchResult {
  title: string;
  link?: string;
}

export async function getGoogleSearchResults(query: string, query2: string , pages: number = 3): Promise<GoogleSearchResult[]> {
  const results: GoogleSearchResult[] = [];
  let searchUrl: string = `https://www.google.com/search?q=${encodeURIComponent(query)+encodeURIComponent(query2)}`;

  for (let i = 0; i < pages; i++) {
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });
    const data = await response.text(); // fetch의 결과를 text로 읽어옴

    const $ = cheerio.load(data);
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

export async function getNaverSearchResults(query: string, query2: string ,pages: number = 3): Promise<NaverSearchResult[]> {
  const results: NaverSearchResult[] = [];
  let searchUrl: string = `https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=0&ie=utf8&query=${encodeURIComponent(query)+encodeURIComponent(query2)}`;

  for (let i = 0; i < pages; i++) {
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });
    const data = await response.text(); // fetch의 결과를 text로 읽어옴
    const $ = cheerio.load(data);

    // 검색 결과 추출
    console.log('크롤링결과 인기글 타이틀', $('div.title_area').text()) // 인기글 타이틀
    console.log('크롤링결과 뉴스 타이틀', $('a.news_tit').text()) // 뉴스헤드라인
    console.log('크롤링결과 리스트 타이틀', $('div.total_tit').text()) // 검색결과 더보기 타이틀
    console.log('크롤링결과 지식인 타이틀', $('div.question_group').text()) // 지식인 타이틀
    // console.log('크롤링결과 파워링크 타이틀', $('a.lnk_head').text()) // 파워링크 타이틀
    // console.log('크롤링결과 메인광고 타이틀', $('a.main_title').text()) // 메인광고 타이틀 : 맨위 이미지와 영상 들어가는것,lg그램검색시 나옴
    // console.log('크롤링결과 브랜드 콘텐츠', $('a.fds-comps-right-image-text-title').text()) // 브랜드콘텐츠 : 쿼리가 하나일 때만 검색결과가 존재한다
    
    $('div.title_area').each((index : number, element : any )=> {
      const title: string = $(element).text() // 데이터 구조를 바꿔야한다
      const link : string | undefined = $(element).find('a').attr('href')
      if(link) {
        results.push({ title, link });
      }
    } )
    const naverResult = {
     
      newsContent : {
        title : $('a.news_tit').text(),
        link : $('a.news_tit').attr('href')
      },

    }   
    console.log('크롤링결과 인기글 타이틀', $('div.title_area')) // 인기글 타이틀
    console.log('naverResult',naverResult)

    // 다음 페이지의 URL 찾기
    const nextPageLink: string | undefined = $('div.sc_page_inner').find('a').attr('href');
    if (!nextPageLink) {
      break; // 다음 페이지가 없으면 종료
    }
    searchUrl = `https://search.naver.com/search.naver${nextPageLink}`;
  }

  return results;
}

