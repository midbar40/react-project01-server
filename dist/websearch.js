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
const node_fetch_1 = __importDefault(require("node-fetch"));
const cheerio = __importStar(require("cheerio"));
function getGoogleSearchResults(query_1) {
    return __awaiter(this, arguments, void 0, function* (query, pages = 1) {
        const results = [];
        let searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
        for (let i = 0; i < pages; i++) {
            const response = yield (0, node_fetch_1.default)(searchUrl, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                },
            });
            const data = yield response.text(); // fetch의 결과를 text로 읽어옴
            const $ = cheerio.load(data);
            console.log('google데이터', $);
            // 검색 결과 추출
            $('div.g').each((index, element) => {
                const title = $(element).find('h3').text();
                const link = $(element).find('a').attr('href');
                const snippet = $(element).find('.IsZvec').text();
                if (link) { // 링크가 존재할 때만 결과에 추가
                    results.push({ title, link, snippet });
                }
            });
            // 다음 페이지의 URL 찾기
            const nextPageLink = $('a#pnnext').attr('href');
            if (!nextPageLink) {
                break; // 다음 페이지가 없으면 종료
            }
            searchUrl = `https://www.google.com${nextPageLink}`;
        }
        return results;
    });
}
function getNaverSearchResults(query_1) {
    return __awaiter(this, arguments, void 0, function* (query, pages = 1) {
        const results = [];
        let searchUrl = `https://search.naver.com/search.naver?query=${encodeURIComponent(query)}`;
        for (let i = 0; i < pages; i++) {
            const response = yield (0, node_fetch_1.default)(searchUrl, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                },
            });
            const data = yield response.text(); // fetch의 결과를 text로 읽어옴
            const $ = cheerio.load(data);
            console.log('네이버데이터', data);
            // 검색 결과 추출
            $('div mark').parent().each((index, element) => {
                const title = $(element).find('a').text();
                const link = $(element).find('a').attr('href');
                const snippet = $(element).find('.IsZvec').text();
                console.log('title', title);
                if (link) { // 링크가 존재할 때만 결과에 추가
                    results.push({ title, link, snippet });
                }
            });
            // 다음 페이지의 URL 찾기
            const nextPageLink = $('a#pnnext').attr('href');
            if (!nextPageLink) {
                break; // 다음 페이지가 없으면 종료
            }
            searchUrl = `https://www.naver.com${nextPageLink}`;
        }
        return results;
    });
}
exports.default = { getGoogleSearchResults, getNaverSearchResults };
