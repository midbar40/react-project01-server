"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNaverSearchResults = exports.getGoogleSearchResults = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const cheerio = __importStar(require("cheerio"));
4;
const uuid_1 = require("uuid");
function getGoogleSearchResults(query_1, query2_1) {
    return __awaiter(this, arguments, void 0, function* (query, query2, pages = 3) {
        const results = [];
        let searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query) + encodeURIComponent(query2)}`;
        for (let i = 0; i < pages; i++) {
            const response = yield (0, node_fetch_1.default)(searchUrl, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                },
            });
            const data = yield response.text(); // fetch의 결과를 text로 읽어옴
            const $ = cheerio.load(data);
            // 검색 결과 추출
            $('div.g').each((index, element) => {
                const key = (0, uuid_1.v4)();
                const title = $(element).find('h3').text();
                const link = $(element).find('a').attr('href');
                if (link) { // 링크가 존재할 때만 결과에 추가
                    results.push({ type: '일반검색', key, title, link });
                }
            });
            // 구글 스폰서 콘텐츠 코드 추가, pc마다 달라지는지 확인필요
            $('div.CCgQ5 vCa9Yd QfkTvb N8QANc Va3FIb EE3Upf').each((index, element) => {
                console.log('스폰서 결과', element);
                const key = (0, uuid_1.v4)();
                const title = $(element).find('h3').text();
                const link = $(element).find('a').attr('href');
                if (link) { // 링크가 존재할 때만 결과에 추가
                    results.push({ type: '스폰서-1', key, title, link });
                }
            });
            $('div.RnJeZd top pla-unit-title').each((index, element) => {
                const key = (0, uuid_1.v4)();
                const title = $(element).find('h3').text();
                const link = $(element).find('a').attr('href');
                if (link) { // 링크가 존재할 때만 결과에 추가
                    results.push({ type: '스폰서-2', key, title, link });
                }
            });
            // 구글 주요뉴스
            $('div.n0jPhd ynAwRc tNxQIb nDgy9d').each((index, element) => {
                const key = (0, uuid_1.v4)();
                const title = $(element).find('h3').text();
                const link = $(element).find('a').attr('href');
                if (link) { // 링크가 존재할 때만 결과에 추가
                    results.push({ type: '뉴스-1', key, title, link });
                }
            });
            $('div.y05Tsc tNxQIb ynAwRc OSrXXb').each((index, element) => {
                const key = (0, uuid_1.v4)();
                const title = $(element).find('h3').text();
                const link = $(element).find('a').attr('href');
                if (link) { // 링크가 존재할 때만 결과에 추가
                    results.push({ type: '뉴스-2', key, title, link });
                }
            });
            // 관련검색어
            $('div.wyccme').each((index, element) => {
                const key = (0, uuid_1.v4)();
                const title = $(element).find('h3').text();
                const link = $(element).find('a').attr('href');
                if (link) { // 링크가 존재할 때만 결과에 추가
                    results.push({ type: '관련검색어', key, title, link });
                }
            });
            console.log(results);
            // 다음 페이지의 URL 찾기
            const nextPageLink = $('a#pnnext').attr('href');
            if (!nextPageLink) {
                console.log('여기 들어오긴하니');
                break; // 다음 페이지가 없으면 종료
            }
            searchUrl = `https://www.google.com${nextPageLink}`;
        }
        return results;
    });
}
exports.getGoogleSearchResults = getGoogleSearchResults;
function getNaverSearchResults(query_1, query2_1) {
    return __awaiter(this, arguments, void 0, function* (query, query2, pages = 3) {
        const results = [];
        let searchUrl = `https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=0&ie=utf8&query=${encodeURIComponent(query) + encodeURIComponent(query2)}`;
        for (let i = 0; i < pages; i++) {
            const response = yield (0, node_fetch_1.default)(searchUrl, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                },
            });
            const data = yield response.text(); // fetch의 결과를 text로 읽어옴
            const $ = cheerio.load(data);
            // 인기글
            $('div.title_area').each((index, element) => {
                const key = (0, uuid_1.v4)();
                const title = $(element).text();
                const link = $(element).find('a').attr('href');
                if (link) {
                    results.push({ key, type: '인기검색', title, link });
                }
            });
            // 뉴스
            $('a.news_tit').each((index, element) => {
                const key = (0, uuid_1.v4)();
                const title = $(element).text();
                const link = $(element).attr('href');
                if (link) {
                    results.push({ key, type: '뉴스', title, link });
                }
            });
            // 리스트글 : 검색결과 더보기 
            $('div.total_tit').each((index, element) => {
                const key = (0, uuid_1.v4)();
                const title = $(element).text();
                const link = $(element).find('a').attr('href');
                if (link) {
                    results.push({ key, type: '리스트', title, link });
                }
            });
            // 지식인
            $('div.question_group').each((index, element) => {
                const key = (0, uuid_1.v4)();
                const title = $(element).text();
                const link = $(element).find('a').attr('href');
                if (link) {
                    results.push({ key, type: '지식인', title, link });
                }
            });
            // 파워링크
            $('a.lnk_head').each((index, element) => {
                const key = (0, uuid_1.v4)();
                const title = $(element).text().replace(/[\s\n]+/g, ''); // 공백과 줄바꿈 문자 제거 regex
                const link = $(element).attr('href');
                if (link) {
                    results.push({ key, type: '파워링크', title, link });
                }
            });
            // 메인배너, 이미지,동영상,최상단
            $('a.main_title').each((index, element) => {
                const key = (0, uuid_1.v4)();
                const title = $(element).text();
                const link = $(element).attr('href');
                if (link) {
                    results.push({ key, type: '메인배너', title, link });
                }
            });
            // 브랜드콘텐츠 : 쿼리가 하나일 때만 검색결과가 존재한다
            $('a.fds-comps-right-image-text-title').each((index, element) => {
                const key = (0, uuid_1.v4)();
                const title = $(element).text();
                const link = $(element).attr('href');
                if (link) {
                    results.push({ key, type: '브랜드콘텐츠', title, link });
                }
            });
            // 다음 페이지의 URL 찾기
            const nextPageLink = $('a.btn_next').attr('href');
            if (!nextPageLink) {
                break; // 다음 페이지가 없으면 종료
            }
            searchUrl = `https://search.naver.com/search.naver${nextPageLink}`;
        }
        return results;
    });
}
exports.getNaverSearchResults = getNaverSearchResults;
