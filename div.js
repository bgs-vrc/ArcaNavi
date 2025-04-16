function isNumeric(num) {
  num = String(num).trim();
  return /^[0-9]+$/.test(num);
}

function getPostIdFromURL(url) {
  let parts = url.split("/");
  return parts.length >= 4 ? parts[3] : "";
}

let listarr = [];
let listnum = [];

function list_hotkey() {
  const articles = document.querySelectorAll("a.vrow.column");
  let j = 0, k = 1;

  articles.forEach((el) => {
    const href = el.getAttribute("href");
    if (href && isNumeric(getPostIdFromURL(href))) {
      if (j < 10) {
        if (k === 10) k = 0;
        el.innerHTML += ` [${k}]`;
        k++;
      }
      listarr[j] = "https://arca.live" + href;
      listnum[j] = getPostIdFromURL(href);
      j++;
    }
  });
}

(function () {
  list_hotkey();
})();
