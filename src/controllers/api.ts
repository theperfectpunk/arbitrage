"use strict";

import { Response, Request } from "express";
import { BinanceService } from "../services/binance.service";
import { WazirxService } from "../services/wazirx.service";
import { ArbitrageService } from "../services/arbitrage.service";
import { DEFAULT_EXCHANGE_RATE } from "../constants/app.constant";

/**
 * List of API examples.
 * @route GET /api
 */
export const getApi = (req: Request, res: Response) => {
    res.render("api/index", {
        title: "API Examples"
    });
};

export const getArbitrage = (req: Request, res: Response) => {
    const exchangeRate = typeof req.query.rate === "string" ? parseFloat(req.query.rate) : DEFAULT_EXCHANGE_RATE;
    ArbitrageService.getArbitrage(exchangeRate).then(arbitrage => {
        res.statusCode = 200;
        res.json({ arbitrage });
    });
};

export const getWazirX = (req: Request, res: Response) => {
    WazirxService.getPrice().then(priceList => {
        res.statusCode = 200;
        res.json({ priceList });
    });
};

export const getBinance = (req: Request, res: Response) => {
    BinanceService.getPrice().then(priceList => {
        res.statusCode = 200;
        res.json({ priceList });
    });
};