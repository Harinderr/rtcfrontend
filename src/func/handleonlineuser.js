import axios from "@/utility/axios";
const profile = async () => {
  const response = await axios.get("/user");
  // console.log(response)
  return response;
};


export const handleOnlineUserData = async (data,id) => {
try {  //rest of the user
  const res = await profile();
 
    const newdata =
    data.online && data.online.filter((item) => item.userid != res.data.userid);

const newMap = new Map();
newdata.forEach((e) => {
  if (!newMap.has(e.userid)) {
    newMap.set(e.userid, e.username);
  }
});
return newMap

}
  catch(err) {
    console.log('this is error',err)
  }
};
