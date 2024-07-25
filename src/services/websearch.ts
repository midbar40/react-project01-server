import fetch from 'node-fetch';
import * as cheerio from 'cheerio'; 4
import { v4 } from 'uuid';

interface GoogleSearchResult {
  key: string;
  type?: string;
  title: string;
  link?: string;
}

interface NaverSearchResult {
  type: '인기검색' | '뉴스' | '리스트' | '지식인' | '파워링크' | '메인배너' | '브랜드콘텐츠'
}

interface PopularSearchResult extends NaverSearchResult {
  key: string;
  title: string;
  link?: string;
}

interface NewsSearchResult extends NaverSearchResult {
  key: string;
  title: string;
  link?: string;
}

interface ListSearchResult extends NaverSearchResult {
  key: string;
  title: string;
  link?: string;
}

interface QuestionSearchResult extends NaverSearchResult {
  key: string;
  title: string;
  link?: string;
}

interface PowerlinkSearchResult extends NaverSearchResult {
  key: string;
  title: string;
  link?: string;
}

interface MainbannerSearchResult extends NaverSearchResult {
  key: string;
  title: string;
  link?: string;
}

interface BrandContentSearchResult extends NaverSearchResult {
  key: string;
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
      const key: string = v4();
      const title: string = $(element).find('h3').text();
      const link: string | undefined = $(element).find('a').attr('href');
      if (link) { // 링크가 존재할 때만 결과에 추가
        results.push({ type:'일반검색',key, title, link });
      }
    });
    // 구글 스폰서 콘텐츠 코드 텍스트형, pc마다 달라지는지 확인필요
    $('div.v5yQqb').each((index: number, element: any) => {
      const key: string = v4();
      const title: string = $(element).find('span').text();
      const link: string | undefined = $(element).find('a').attr('href');
      if (link) { // 링크가 존재할 때만 결과에 추가
        results.push({ type: '스폰서', key, title, link });
      }
    });
     // 구글 스폰서 콘텐츠 코드 이미지박스형, pc마다 달라지는지 확인필요
     $('div.top-pla-group-inner').each((index: number, element: any) => {
      const key: string = v4();
      const title: string = $(element).find('span').text();
      const link: string | undefined = $(element).find('a').attr('href');
      if (link) { // 링크가 존재할 때만 결과에 추가
        results.push({ type: '스폰서', key, title, link });
      }
    });
    // 구글 동영상
    $('div.KYaZsb').each((index: number, element: any) => {
      const key: string = v4();
      const title: string = $(element).find('span.cHaqb').text();
      const link: string | undefined = $(element).find('a.xMqpbd').last().attr('href');
      if (link) { // 링크가 존재할 때만 결과에 추가
        results.push({ type: '동영상', key, title, link });
      }
    });
     // 구글 이미지
     $('a.EZAeBe').each((index: number, element: any) => {
      const key: string = v4();
      const title: string = $(element).find('div.toI8Rb').text();
      const link: string | undefined = $(element).attr('href');
      if (link) { // 링크가 존재할 때만 결과에 추가
        results.push({ type: '동영상', key, title, link });
      }
    });
    // 구글 주요뉴스
    $('a.YKoRaf').each((index: number, element: any) => {
      const key: string = v4();
      const title: string = $(element).find('div.n0jPhd').text();
      const link: string | undefined = $(element).attr('href');
      if (link) { // 링크가 존재할 때만 결과에 추가
        results.push({ type: '뉴스', key, title, link });
      }
    });
    // 관련검색어
    $('a.ngTNl').each((index: number, element: any) => {
      const key: string = v4();
      const title: string = $(element).find('span').text();
      const link: string | undefined = $(element).attr('href');
      if (link) { // 링크가 존재할 때만 결과에 추가
        results.push({ type: '관련검색어', key, title, link });
      }
    });


    // 다음 페이지의 URL 찾기
    const nextPageLink: string | undefined = $('a#pnnext').attr('href');
    if (!nextPageLink) {
      console.log('여기 들어오긴하니')
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
      const key: string = v4();
      const title: string = $(element).text()
      const link: string | undefined = $(element).find('a').attr('href')
      if (link) {
        results.push({ key, type: '인기검색', title, link });
      }
    })
    // 뉴스
    $('a.news_tit').each((index: number, element: any) => {
      const key: string = v4();
      const title: string = $(element).text()
      const link: string | undefined = $(element).attr('href')
      if (link) {
        results.push({ key, type: '뉴스', title, link });
      }
    })
    // 리스트글 : 검색결과 더보기 
    $('div.total_tit').each((index: number, element: any) => {
      const key: string = v4();
      const title: string = $(element).text()
      const link: string | undefined = $(element).find('a').attr('href')
      if (link) {
        results.push({ key, type: '리스트', title, link });
      }
    })
    // 지식인
    $('div.question_group').each((index: number, element: any) => {
      const key: string = v4();
      const title: string = $(element).text()
      const link: string | undefined = $(element).find('a').attr('href')
      if (link) {
        results.push({ key, type: '지식인', title, link });
      }
    })
    // 파워링크
    $('a.lnk_head').each((index: number, element: any) => {
      const key: string = v4();
      const title: string = $(element).text().replace(/[\s\n]+/g, ''); // 공백과 줄바꿈 문자 제거 regex
      const link: string | undefined = $(element).attr('href')
      if (link) {
        results.push({ key, type: '파워링크', title, link });
      }
    })
    // 메인배너, 이미지,동영상,최상단
    $('a.main_title').each((index: number, element: any) => {
      const key: string = v4();
      const title: string = $(element).text()
      const link: string | undefined = $(element).attr('href')
      if (link) {
        results.push({ key, type: '메인배너', title, link });
      }
    })
    // 브랜드콘텐츠 : 쿼리가 하나일 때만 검색결과가 존재한다
    $('a.fds-comps-right-image-text-title').each((index: number, element: any) => {
      const key: string = v4();
      const title: string = $(element).text()
      const link: string | undefined = $(element).attr('href')
      if (link) {
        results.push({ key, type: '브랜드콘텐츠', title, link });
      }
    })

    // 다음 페이지의 URL 찾기
    const nextPageLink: string | undefined = $('a.btn_next').attr('href');
    if (!nextPageLink) {
      break; // 다음 페이지가 없으면 종료
    }
    searchUrl = `https://search.naver.com/search.naver${nextPageLink}`;
  }

  return results;
}

