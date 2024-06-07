"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const websearch_1 = __importDefault(require("../websearch"));
const { getGoogleSearchResults, getNaverSearchResults } = websearch_1.default;
const router = express_1.default.Router();
router.post("/", (req, res) => {
    // getGoogleSearchResults(req.body.name, 5)
    // .then(results => {
    //   console.log(results)
    //   res.json(results)
    // })
    // .catch(err => console.error(err));
    console.log('리퀘바디', req.body.name);
    getNaverSearchResults(req.body.name, 5)
        .then(results => {
        console.log('출력', results);
        res.json(results);
    })
        .catch(err => console.error(err));
});
exports.default = router;
