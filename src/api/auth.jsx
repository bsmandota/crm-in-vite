import axios from "axios";

const BASE_URL = "https://crm-be-4scm.onrender.com";

/**
 * SIGNUP :
 * POST : api
 * url : /crm/api/v1/auth/signup
 * data: userid,email, name, pw
 */

export async function userSignup(data) {
  return await axios.post(`${BASE_URL}/crm/api/v1/auth/signup`, data);
}
/**
 * SignIN:
 * POST:api
 * url : /crm/api/v1/auth/sign
 * data:userid, pw
 */

export async function userSignin(data) {
  return await axios.post(`${BASE_URL}/crm/api/v1/auth/signin`, data);
}
