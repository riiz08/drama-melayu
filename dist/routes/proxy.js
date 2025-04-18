"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/proxy.ts
const express_1 = require("express");
const axios_1 = __importDefault(require("axios"));
const router = (0, express_1.Router)();
router.get("/", async (req, res) => {
    const targetUrl = req.query.url;
    if (!targetUrl) {
        return;
    }
    try {
        const response = await axios_1.default.get(targetUrl, {
            headers: {
                "User-Agent": req.get("User-Agent") || "Mozilla/5.0",
            },
            responseType: "stream", // ⬅ penting untuk streaming HLS
        });
        res.set(response.headers);
        response.data.pipe(res); // forward langsung ke client
    }
    catch (error) {
        console.error("Proxy error:", error.message);
        res
            .status(500)
            .json({ success: false, message: "Failed to fetch target URL" });
    }
});
exports.default = router;
