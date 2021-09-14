import { Request, Response } from "express";
import { API_INTERVAL, CRYPTO, DEFAULT_EXCHANGE_RATE } from "../constants/app.constant";
import { ArbitrageService } from "../services/arbitrage.service";

/**
 * Home page.
 * @route GET /
 */
export const index = (req: Request, res: Response) => {
    const interval = API_INTERVAL+1000;
    const exchangeRate = typeof req.query.rate === "string" ? parseFloat(req.query.rate) : DEFAULT_EXCHANGE_RATE;
    ArbitrageService.getArbitrage(exchangeRate).then(arbitrage => {
        res.render("home", {
            title: "Home",
            arbitrage,
            exchangeRate,
            interval,
        });
    });
};
