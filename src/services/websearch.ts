import fetch from 'node-fetch';
import * as cheerio from 'cheerio'; 4
import { v4 } from 'uuid';

interface GoogleSearchResult {
  key: string;
  type?: string;
  title: string;
  content?: string;
  link?: string;
}

interface NaverSearchResult {
  key: string;
  type?: string
  title: string;
  content?: string;
  link?: string;
}

export async function getGoogleSearchResults(brandName: string, keyword: string, pages: number = 1): Promise<GoogleSearchResult[]> {
  const results: GoogleSearchResult[] = [];
  let searchUrl: string = `https://www.google.com/search?q=${encodeURIComponent(keyword)}`;

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
      const content = $(element).find('span').text();
      const link: string | undefined = $(element).find('a').attr('href');
      if (link) { // 링크가 존재할 때만 결과에 추가
        results.push({ type: '일반검색', key, title, content, link });
      }
    });
    // 구글 스폰서 콘텐츠 코드 텍스트형, pc마다 달라지는지 확인필요
    $('div.vdQmEd').each((index: number, element: any) => {
      const key: string = v4();
      const title: string = $(element).find('div.sVXRqc').find('span').text();
      const content = $(element).find('div.Z6lobc').text();
      const link: string | undefined = $(element).find('div.v5yQqb').find('a').attr('href');
      if (link) { // 링크가 존재할 때만 결과에 추가
        results.push({ type: '스폰서', key, title, content, link });
      }
    });

    // 구글 스폰서 콘텐츠 코드 이미지박스형 우측면위치, pc마다 달라지는지 확인필요
    $('div.cu-container').each((index: number, element: any) => {
      const key: string = v4();
      const title: string = $(element).find('div.orXoSd > span').text();
      const content: string = $(element).find('div.LbUacb > span').text();
      const link: string | undefined = $(element).find('a').attr('href');
      if (link) { // 링크가 존재할 때만 결과에 추가
        results.push({ type: '스폰서', key, title, content, link });
      }
    });

    // 구글 스폰서 콘텐츠 코드 이미지박스형Top위치, pc마다 달라지는지 확인필요
    $('div.pla-unit-container').each((index: number, element: any) => {
      const key: string = v4();
      const title: string = $(element).find('div.orXoSd > span').text();
      const content: string = $(element).find('div.LbUacb > span').text();
      const link: string | undefined = $(element).find('a').attr('href');
      if (link) { // 링크가 존재할 때만 결과에 추가
        results.push({ type: '스폰서', key, title, content, link });
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
      break; // 다음 페이지가 없으면 종료
    }
    searchUrl = `https://www.google.com${nextPageLink}`;
  }
  return results.filter(ele => (ele.title.includes(brandName) || ele.content?.includes(brandName)));
}

export async function getNaverSearchResults(brandName: string, keyword: string, pages: number = 1): Promise<NaverSearchResult[]> {
  const results: NaverSearchResult[] = [];
  let searchUrl: string = `https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=0&ie=utf8&query=${encodeURIComponent(keyword)}`;

  for (let i = 0; i < pages; i++) {
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });
    const data = await response.text(); // fetch의 결과를 text로 읽어옴
    const $ = cheerio.load(data);

    // 인기글
    $('div.view_wrap').each((index: number, element: any) => {
      const key: string = v4();
      const title: string = $(element).find('div.title_area').text()
      const content: string = $(element).find('div.dsc_area > a').text()
      const link: string | undefined = $(element).find('div.title_area > a').attr('href')
      if (link) {
        results.push({ key, type: '인기검색', title, content, link });
      }
    })
    // 뉴스news_contents
    $('div.news_contents').each((index: number, element: any) => {
      const key: string = v4();
      const title: string = $(element).find('a.news_tit').text()
      const content: string = $(element).find('div.dsc_wrap').text()
      const link: string | undefined = $(element).find('a.news_tit').attr('href')
      if (link) {
        results.push({ key, type: '뉴스', title, content, link });
      }
    })
    // 리스트글 : 검색결과 더보기 lst_total
    $('div. total_group').each((index: number, element: any) => {
      const key: string = v4();
      const title: string = $(element).find('div.total_tit').text()
      const content: string = $(element).find('div.total_dsc_wrap').text()
      const link: string | undefined = $(element).find('a.link_tit').attr('href')
      if (link) {
        results.push({ key, type: '리스트', title, content, link });
      }
    })
    // 지식인 lst_nkin
    $('div.kin_wrap').each((index: number, element: any) => {
      const key: string = v4();
      const title: string = $(element).find('div.question_txt').text()
      const content = $(element).find('div.question_txt > div.answer_area').text()
      const link: string | undefined = $(element).find('div.question_txt > a').attr('href')
      if (link) {
        results.push({ key, type: '지식인', title, content, link });
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
    // 브랜드콘텐츠, 인플루언서 참여콘텐츠, 내돈내산 콘텐츠
    $('div.fds-comps-right-image-content-container').each((index: number, element: any) => {
      const key: string = v4();
      const title: string = $(element).find('span.uqygfkxiRj7Y5r_cvxbX').text()
      const content: string = $(element).find('span.uqygfkxiRj7Y5r_cvxbX').text()
      const link: string | undefined = $(element).find('div.fds-comps-right-image-text-container > a:first').attr('href')
      if (link) {
        results.push({ key, type: '콘텐츠', title, content, link });
      }
    })

    // 다음 페이지의 URL 찾기
    const nextPageLink: string | undefined = $('a.btn_next').attr('href');
    if (!nextPageLink) {
      break; // 다음 페이지가 없으면 종료
    }
    searchUrl = `https://search.naver.com/search.naver${nextPageLink}`;
  }

  return results.filter(ele => (ele.title.includes(brandName) || ele.content?.includes(brandName)));
}

