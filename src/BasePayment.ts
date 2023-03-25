import axios, {AxiosBasicCredentials, AxiosRequestConfig, AxiosResponse} from "axios";

export type HTTP_METHODS = "GET"|"POST"|"PUT"|"DELETE"

export abstract class BasePayment {
    protected async doRequest(url: string, method:HTTP_METHODS='GET', data?:any, headers?:object, auth?:AxiosBasicCredentials): Promise<AxiosResponse>{
        const requestConfiguration: AxiosRequestConfig = {
            method: method,
            url: url,
            headers: {
                'User-Agent': 'node-payments-lib/3.0'
            },
            data: data,
            maxRedirects: 0,
            auth: auth
        }

        if (headers){
            Object.assign(requestConfiguration.headers, headers)
        }

        try {
            return await axios(requestConfiguration)
        }catch (error){
            return error.response
        }
    }
}
