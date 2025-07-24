//Using this function send the request to the Backend in this define some attribute
import axios from "axios"

export const axiosInstance = axios.create({});

export const apiConnector = (method, url, bodyData, headers, params) => {
    return axiosInstance({
        method:`${method}`,//define method (i.e get,post,put delete)
        url:`${url}`,//Route of the Backend 
        data: bodyData ? bodyData : null,//Actual what data Send on the server 
        headers: headers ? headers: null,//header me jo send karana ho 
        params: params ? params : null,//params jo send karana ho 
    });
}