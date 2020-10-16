import Axios from "axios";

import axios from "axios";
export const signup = (user) => {
  return fetch("/api/signup", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};
export const login = (user) => {
  return fetch("/api/login", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

// export const signout = (next) => {
//   if (typeof window !== "undefined") {
//     localStorage.clear();
//     next();

//     return fetch(`${API}/logout`, {
//       method: "GET",
//     })
//       .then((response) => console.log("signout success"))
//       .catch((err) => console.log(err));
//   }
// };
export const logout = async (user) => {
  return await axios
    .get("/api/logout", user)
    .then((response) => localStorage.removeItem("jwt", response.data))
    .catch((err) => {
      console.log(err);
    });
};

export const authenticate = (data, next) => {
  if (typeof window != undefined) {
    localStorage.setItem("jwt", JSON.stringify(data));
    localStorage.setItem("id", data.id);
    next();
  }
};
export const isAthunticated = () => {
  if (typeof window != undefined) {
    return false;
  }
  if (localStorage.getItem("id")) {
    return JSON.parse(localStorage.getItem("id"));
  } else {
    return false;
  }
};
export const Adminsignup = (user) => {
  return fetch(`/api/admin/signup`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};
export const Adminlogin = (user) => {
  return fetch(`/api/admin/login`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};
export const createProduct = (formdata) => {
  return Axios.post(`/api/book/add`, {
    title: formdata.title,
    ISBN: formdata.ISBN,
    author: formdata.author,
    description: formdata.description,
    category: formdata.category,
    stock: formdata.stock,
  }).then((response) => console.log(response.data));
};
