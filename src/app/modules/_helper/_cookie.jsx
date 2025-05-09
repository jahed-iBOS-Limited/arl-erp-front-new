export const setCookie = (cname, cvalue, exdays) => {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  let expires = 'expires=' + d.toUTCString();
  if (import.meta.env.MODE === 'development') {
    document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
  } else {
    document.cookie =
      cname + '=' + cvalue + ';' + expires + ';domain=.ibos.io;path=/;';
  }
};

export const getCookie = (cname) => {
  let name = cname + '=';
  let ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return '';
};

export const setPeopledeskCookie = (cname, cvalue, exdays) => {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  let expires = 'expires=' + d.toUTCString();
  if (import.meta.env.MODE === 'development') {
    document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
  } else {
    document.cookie =
      cname + '=' + cvalue + ';' + expires + ';domain=.peopledesk.io;path=/;';
  }
};
