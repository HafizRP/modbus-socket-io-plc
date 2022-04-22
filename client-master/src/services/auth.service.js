const axios = require("axios");

class AuthService {
  Login(user) {
    return axios
      .post("http://localhost:3000/api/auth/login", {
        username: user.username,
        password: user.password,
      })
      .then((result) => {
        if (result.data.accessToken) {
          localStorage.setItem("user", JSON.stringify(result.data));
        }
        return result.data;
      })
      .catch((err) => {});
  }

  Logout() {
    localStorage.removeItem("user");
  }

  Register(user) {
    return axios.post("http://localhost:3000/api/auth/register", {
      username: user.username,
      email: user.email,
      password: user.password,
    });
  }
}

export default new AuthService();
