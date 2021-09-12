import axios from "axios";
import { EncodeDecodeType } from "../constants/encode-decode.enum";
import ErrorService from "./error.service";
// import store from '../store/redux-store';
import { AppConfig } from "../config/app";

export class CustomHttpService {
  static post(url: string, data: any, config: any, encodeDecodeType: string, retry_count?: number): Promise<any> {
    switch (encodeDecodeType) {
      case EncodeDecodeType.DEFAULT:
        _addDefaultConfig(config);
        return _defaultPost(url, data, config);
      default:
        return new Promise((resolve, reject) => reject({ message: "Invalid Encoding" }));
    }
  }

  static get(url: string, config: any, encodeDecodeType: string, retry_count?: number): Promise<any> {
    switch (encodeDecodeType) {
      case EncodeDecodeType.DEFAULT:
        _addDefaultConfig(config);
        return _defaultGet(url, config);


      default:
        return new Promise((resolve, reject) => reject({ message: "Invalid Encoding" }));
    }
  }

  static put(url: string, data: any, config: any, encodeDecodeType: string, retry_count?: number): Promise<any> {

    switch (encodeDecodeType) {
      case EncodeDecodeType.DEFAULT:
        _addDefaultConfig(config);
        return _defaultPut(url, data, config);
      default:
        return new Promise((resolve, reject) => reject({ message: "Invalid Encoding" }));
    }
  }
  static delete(url: string, config: any, encodeDecodeType: string): Promise<any> {
    switch (encodeDecodeType) {
      case EncodeDecodeType.DEFAULT:
        _addDefaultConfig(config);
        return _defaultDelete(url, config);
      default:
        return new Promise((resolve, reject) => reject({ message: "Invalid Encoding" }));
    }
  }
}

const _addDefaultConfig = (config: any) => {
  if (!config) {
    config = {};
  }
  if (!config["timeout"]) {
    config["timeout"] = AppConfig.apiTimeOutOption.default;
    // config["timeout"] = 30000;
  }
  if (!config["headers"]) {
    config["headers"] = {};
  }
  if (!config["headers"]["Content-Type"]) {
    config["headers"]["Content-Type"] = "application/json";
  }
};

const _defaultGet = (url: string, config: any) => {
  return new Promise((resolve, reject) => {
    axios.get(url, config).then(

      (response: any) => {
        resolve(response);
      },
      (error: any) => {
        if (error && error.response && error.response.status && error.response.status === 401) {
          ErrorService.unauthorizedRequestHandler();
          reject(error);
        }
        else {
          reject(error);
        }
      }
    );
  });
};

const _defaultPost = (url: string, data: any, config: any) => {
  return new Promise((resolve, reject) => {
    axios.post(url, data, config).then(

      (response: any) => {
        resolve(response);
      },
      (error: any) => {
        if (error && error.response && error.response.status && error.response.status === 401) {
          ErrorService.unauthorizedRequestHandler();
          reject(error);
        }
        else {
          reject(error);
        }
      }
    );
  });
};

const _defaultPut = (url: string, data: any, config: any) => {
  return new Promise((resolve, reject) => {
    axios.put(url, data, config).then(

      (response: any) => {
        resolve(response);
      },
      (error: any) => {
        if (error && error.response && error.response.status && error.response.status === 401) {
          ErrorService.unauthorizedRequestHandler();
          reject(error);
        }
        else {
          reject(error);
        }
      }
    );
  });
};
const _defaultDelete = (url: string, config: any) => {
  return new Promise((resolve, reject) => {
    axios.delete(url, config).then(

      (response: any) => {
        resolve(response);
      },
      (error: any) => {
        if (error && error.response && error.response.status && error.response.status === 401) {
          ErrorService.unauthorizedRequestHandler();
          reject(error);
        }
        else {
          reject(error);
        }
      }
    );
  });
};