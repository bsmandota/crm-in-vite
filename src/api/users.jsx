import axios from "axios";

// const userId = localStorage.getItem("userId");
export default async function fetchUser(userId){
    return await axios.get(`${BASE_URL}/crm/api/v1/users/${userId}`,{
        headers: {
            'x-access-token':localStorage.getItem("token")
        }
        },{
            "userId":localStorage.getItem("userId")}
    )
}
const BASE_URL = "https://crm-be-4scm.onrender.com"
export async function userUpdation( selectedCurrUser){
    return await axios.put(`${BASE_URL}/crm/api/v1/users/9700` , selectedCurrUser,{
        headers:{
            'x-access-token': localStorage.getItem("token")
        }
    },{
        "userId":localStorage.getItem("userId")
    })
}