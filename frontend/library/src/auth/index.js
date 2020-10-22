import axios from "axios";
export const register = async (newUser) => {
  return await axios
    .post("/api/signup", {
      name: newUser.name,
      email: newUser.email,
      password: newUser.password,
      confirm_password: newUser.confirm_password,
    })
    .then((response) => {
      console.log(response.data);
    });
};
export const isAuthenticated = () => {
  if (typeof window == "undefined") {
    return false;
  }
  if (localStorage.getItem("token")) {
    return JSON.parse(localStorage.getItem("token"));
  } else {
    return false;
  }
};
export const login = async (user) => {
  return await axios
    .post("/api/login", {
      email: user.email,
      password: user.password,
    })
    .then((response) => {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("id", response.data.id);
      return response.data;
    })
    .catch((err) => {
      console.log(err);
    });
};
export const logout = async (user) => {
  return await axios
    .get("/api/logout", user)
    .then((response) => localStorage.removeItem("jwt", response.data))
    .catch((err) => {
      console.log(err);
    });
};

export const Adminregister = async (newUser) => {
  return await axios
    .post("/api/admin/signup", {
      name: newUser.name,
      email: newUser.email,
      password: newUser.password,
      confirm_password: newUser.confirm_password,
    })
    .then((response) => {
      console.log("Registered");
    });
};
export const Adminlogin = async (user) => {
  return await axios
    .post("/api/admin/login", {
      email: user.email,
      password: user.password,
    })
    .then((response) => {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("id", response.data.id);
      localStorage.setItem("role", response.data.role);
      return response.data;
    })
    .catch((err) => {
      console.log(err);
    });
};

export const createProduct = (formdata) => {
  return axios
    .post(`/api/book/add`, {
      title: formdata.title,
      ISBN: formdata.ISBN,
      author: formdata.author,
      description: formdata.description,
      category: formdata.category,
      stock: formdata.stock,
    })
    .then((response) => console.log(response.data));
};
export const signup = async (user) => {
  return await axios
    .post("/api/signup", user)
    .then((response) => response.data);
};
