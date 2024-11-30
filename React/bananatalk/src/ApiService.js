import { API_BASE_URL } from "./api-config";

export function call(api, method, request) {
  let headers = new Headers({ "Content-Type": "application/json" });
  const acessToken = localStorage.getItem("ACESS_TOKEN");
  if (acessToken && acessToken !== null) {
    headers.append("Authorization", "Bearer " + acessToken);
  }

  let options = {
    headers: headers,
    url: API_BASE_URL + api,
    method: method,
  };

  if (request) {
    options.body = JSON.stringify(request);
  }

  return fetch(options.url, options)
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else if (response.status === 403) {
        window.location.href = "/login";
      } else {
        Promise.reject(response);
        throw Error(response);
      }
    })
    .catch((error) => {
      console.log("http error");
      console.log(error);
    });
}

export function signin(userDTO) {
  return call("/auth/signin", "POST", userDTO).then((response) => {
    if (response.token) {
      //token이 존재하는 경우 메인화면으로 리디렉트
      localStorage.setItem("ACESS_TOKEN", response.token);
      window.location.href = "/";
    }
  });
}

export function signout() {
  localStorage.setItem("ACESS_TOKEN", null);
  window.location.href = "/login";
}

export function signup(userDTO) {
  return call("/auth/signup", "POST", userDTO);
}

export function getmyname() {
  return call("/auth/username", "GET", null);
}

export function receivefriend() {
  return call("/friend/receive", "POST", null);
}

export function rejectfriend() {
  return call("/friend/reject", "POST", null);
}
