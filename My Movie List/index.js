const BASE_URL = "https://webdev.alphacamp.io";
const INDEX_URL = BASE_URL + "/api/movies/";
const POSTER_URL = BASE_URL + "/posters/";

const movies = [];
const dataPanel = document.querySelector("#data-panel");
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");

// 函式renderMovieList
function renderMovieList(data) {
  let rawHTML = "";

  // processing
  data.forEach((item) => {
    // title,image
    rawHTML += `
  <div class="col-sm-3">
          <div class="mb-2">
            <div class="card">
              <img
                src="${POSTER_URL + item.image}"
                class="card-img-top"
                alt="Movie Poster"
              />
              <div class="card-body">
                <h5 class="card-title">${item.title}</h5>
              </div>
              <div class="card-footer">
                <button
                  class="btn btn-primary btn-show-movie"
                  data-bs-toggle="modal"
                  data-bs-target="#movie-modal"
                  data-id="${item.id}"
                >
                  More
                </button>
                <button class="btn btn-info btn-add-favorite">+</button>
              </div>
            </div>
          </div>
        </div>
  `;
    dataPanel.innerHTML = rawHTML;
  });
}

// 函式showMovieModal
function showMovieModal(id) {
  const modalTitle = document.querySelector("#movie-modal-title");
  const modalImage = document.querySelector("#movie-modal-image");
  const modalDate = document.querySelector("#movie-modal-date");
  const modalDescription = document.querySelector("#movie-modal-description");

  axios
    .get(INDEX_URL + id)
    .then((response) => {
      const data = response.data.results;

      modalTitle.innerText = data.title;
      modalDate.innerText = "realease date: " + data.release_date;
      modalDescription.innerText = data.description;
      modalImage.innerHTML = `
      <img src="${
        POSTER_URL + data.image
      }" alt="movie-poster" class="image-fluid" />
      `;
      // 利用 .img-fluid 設定為響應式圖片
    })
    .catch((err) => console.log(err));
}

// API Movie List
axios
  .get(INDEX_URL)
  .then((response) => {
    movies.push(...response.data.results);
    renderMovieList(movies);
  })
  .catch((err) => console.log(err));

// 監聽dataPanel
dataPanel.addEventListener("click", function onPanelClicked(e) {
  if (e.target.matches(".btn-show-movie")) {
    showMovieModal(e.target.dataset.id);
  }
});

// 監聽searchForm
searchForm.addEventListener("submit", function onSearchFromSubmitted(e) {
  //不要做預設動作(重整瀏覽頁面)
  e.preventDefault();

  // 取得搜尋關鍵字
  const keyword = searchInput.value.trim().toLowerCase();

  // 宣告新變數來儲存篩選後符合關鍵字的電影清單
  let filteredMovies = [];

  // 關鍵字篩選
  filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(keyword)
  );
  console.log(filteredMovies);

  //錯誤處理：無符合條件的結果
  if (filteredMovies.length === 0) {
    return alert(`您輸入的關鍵字：${keyword} 沒有符合條件的電影`);
  }

  // 重新渲染畫面
  renderMovieList(filteredMovies);
});
