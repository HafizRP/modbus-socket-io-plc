import axios from "axios";
import authHeader from "./auth.header";

class UserService {
  getAllData() {
    return axios.get("http://localhost:3000/api/alldata");
  }
}

export default new UserService();
