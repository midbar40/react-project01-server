"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const websearch_1 = require("../services/websearch");
const router = (0, express_1.Router)();
router.post('/google', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, keyword } = req.body;
    const results = yield (0, websearch_1.getGoogleSearchResults)(name, keyword);
    res.json(results);
}));
router.post('/naver', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, keyword } = req.body;
    const results = yield (0, websearch_1.getNaverSearchResults)(name, keyword);
    res.json(results);
}));
exports.default = router;
