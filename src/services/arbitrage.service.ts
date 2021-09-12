import { CRYPTO, CURRENCY_PAIRS } from "../constants/app.constant"
import { BinancePairInfoType, BinanceService } from "./binance.service"
import { WazirxGetPriceResponseType, WazirxService } from "./wazirx.service"

export class ArbitrageService {

  private static arbitrageData: {[x: string]: ArbitrageDataType} | null = null;
  private static isArbitrageUpdateRequired () {
    return (BinanceService.isPriceUpdateRequired() || WazirxService.isPriceUpdateRequired())
  }

  private static transformData (
    binancePriceList: BinancePairInfoType[],
    wazirxPriceList: WazirxGetPriceResponseType
  ): {[cypto: string]: ArbitrageDataType} {
    const transformedData = CRYPTO.reduce((acc: {[crypto: string]: ArbitrageDataType}, crypto) => {
      acc[crypto] = {};
      const usdPriceObj = binancePriceList.find(price => {
        if (price && typeof price.symbol === 'string') {
          return price.symbol.toUpperCase() === `${crypto}${CURRENCY_PAIRS.USDT}`;
        }
      })
      if (usdPriceObj) {
        const cryptoPrice = parseFloat(usdPriceObj.price);
        if (!isNaN(cryptoPrice)) { 
          acc[crypto] = { [CURRENCY_PAIRS.USDT]: cryptoPrice };
        }
      }
      const cryptoKey = `${crypto}${CURRENCY_PAIRS.INR}`.toLowerCase();
      if (wazirxPriceList[cryptoKey]) {
        const cryptoPrice = parseFloat(wazirxPriceList[cryptoKey].last);
        if (!isNaN(cryptoPrice)) {
          acc[crypto] = { ...acc[crypto], [CURRENCY_PAIRS.INR]: cryptoPrice };
        }
      }
      return acc
    }, {})
    return transformedData;
  }

  static injectDiff (transformedData: {[x: string]: ArbitrageDataType}, exchangeRate: number) {
    const diffInjectedData = CRYPTO.reduce((acc: {[crypto: string]: ArbitrageDataType}, crypto) => {
      if (
        transformedData && transformedData[crypto] &&
        !isNaN(transformedData[crypto].USDT) &&
        !isNaN(transformedData[crypto].INR)
      ) {
        acc[crypto].Diff = ((1 - (transformedData[crypto].INR/(transformedData[crypto].USDT*exchangeRate)))*100).toPrecision(4);
      }
      return acc;
    }, transformedData)
    return diffInjectedData
  }

  static getArbitrage (exchangeRate: number) {
    if (!ArbitrageService.arbitrageData || this.isArbitrageUpdateRequired()) {
      return new Promise((resolve) => {
        Promise.all([WazirxService.getPrice(), BinanceService.getPrice()]).then(
          ([wazirxPriceList, binancePriceList]) => {
            const transformedData = ArbitrageService.transformData(binancePriceList, wazirxPriceList)
            ArbitrageService.arbitrageData = transformedData;
            resolve(ArbitrageService.injectDiff(transformedData, exchangeRate));
          }
        )
      })
    } else {
      return new Promise((resolve) => {
        if (ArbitrageService.arbitrageData) {
          resolve(ArbitrageService.injectDiff(ArbitrageService.arbitrageData, exchangeRate));
        } else {
          resolve({});
        }
      })
    }
  }
}

export type ArbitrageDataType = {
  USDT?: number
  INR?: number
  Diff?: string
}
// export type ArbitrageDataType = {
//   [x in keyof typeof CURRENCY_PAIRS]: {[crypto: string]: number}
// }