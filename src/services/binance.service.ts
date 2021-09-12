import { EncodeDecodeType } from "../constants/encode-decode.enum";
import { AppConfig } from "../config/app";
import { CustomHttpService } from "./custom-http.service";
import { AxiosResponse } from "axios";
import { API_INTERVAL } from "../constants/app.constant";

export class BinanceService {

  private static binancePriceResponse: BinancePairInfoType[] = [];
  private static binancePriceRequestTimestamp = 0;

  static isPriceUpdateRequired () {
    return (Date.now() - BinanceService.binancePriceRequestTimestamp >= API_INTERVAL);
  }

  // Get Price Wrapper
  static getPrice(): Promise<BinancePairInfoType[]> {
    if (BinanceService.isPriceUpdateRequired()) {
      return new Promise((resolve) => {
        BinanceService._getPrice().then(
          (response: AxiosResponse<BinancePairInfoType[]>) => {
            BinanceService.binancePriceRequestTimestamp = Date.now();
            BinanceService.binancePriceResponse = response.data
            resolve(response.data);
          },
          (error: any) => {
            resolve([]);
            BinanceService.binancePriceResponse = [];
            BinanceService.binancePriceRequestTimestamp = Date.now();
          }
        );
      });
    }
    return new Promise((resolve) => resolve(BinanceService.binancePriceResponse));
  }
  private static _getPrice(): Promise<AxiosResponse<BinancePairInfoType[]>> {
    const url = `${AppConfig.binanceServicePath}api/v3/ticker/price`;
    return CustomHttpService.get(url, {}, EncodeDecodeType.DEFAULT);
  }
}

export type BinancePairInfoType = {
  symbol: string;
  price: string;
}