import { EncodeDecodeType } from "../constants/encode-decode.enum";
import { AppConfig } from "../config/app";
import { CustomHttpService } from "./custom-http.service";
import { AxiosResponse } from "axios";
import { API_INTERVAL } from "../constants/app.constant";

export class WazirxService {

  private static wazirxPriceResponse: WazirxGetPriceResponseType = {};
  private static wazirxPriceRequestTimestamp = 0;

  static isPriceUpdateRequired () {
    return (Date.now() - WazirxService.wazirxPriceRequestTimestamp >= API_INTERVAL);
  }

  // Get Price Wrapper
  static getPrice(): Promise<WazirxGetPriceResponseType> {
    if (WazirxService.isPriceUpdateRequired()) {
      return new Promise((resolve) => {
        WazirxService._getPrice().then(
          (response: AxiosResponse<WazirxGetPriceResponseType>) => {
            WazirxService.wazirxPriceRequestTimestamp = Date.now();
            WazirxService.wazirxPriceResponse = response.data
            resolve(response.data);
          },
          (error: any) => {
            resolve({});
            WazirxService.wazirxPriceResponse = {};
            WazirxService.wazirxPriceRequestTimestamp = Date.now();
          }
        );
      });
    }
    return new Promise((resolve) => resolve(WazirxService.wazirxPriceResponse));
  }

  static _getPrice(): Promise<AxiosResponse<WazirxGetPriceResponseType>> {
    const url = `${AppConfig.wazirxServicePath}/api/v2/tickers`;
    return CustomHttpService.get(url, {}, EncodeDecodeType.DEFAULT);
  }

}

export type WazirxGetPriceResponseType = {
  [crypto_pair: string]: WazirxPairInfoType
}

export type WazirxPairInfoType = {
  base_unit: string;
  quote_unit: string;
  low: string;
  high: string;
  last: string;
  type: string;
  open: number;
  volume: string;
  sell: string;
  buy: string;
  at: number;
  name: string;
}