import axios from "axios";

const API_KEY = "1oeViSb1Ke71OdGDjnuVF2G8pYJbOmtb313DyxUL";
const HOST = "https://aij1hx90oj.execute-api.ap-southeast-2.amazonaws.com/prod/";

export async function call(endPoint) {
  const url = `${HOST}${endPoint}`;

  const res = await axios.get(
    url,
    {
      headers: {
          "x-api-key": API_KEY
      }
    }
  );  
  return res;
}