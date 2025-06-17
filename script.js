document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('searchGenreBtn').addEventListener('click', searchByGenre);
  document.getElementById('searchNameBtn').addEventListener('click', searchByName);
  document.getElementById('nameInput').addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      searchByName();
    }
  });
});

// ジャンル検索
async function searchByGenre() {
  const resultElm = document.getElementById('result');
  const selectedGenre = document.getElementById('genreSelect').value;

  if (!selectedGenre) {
    resultElm.innerHTML = `<p style="color: red;">ジャンルを選択してください。</p>`;
    return;
  }

  resultElm.innerHTML = `<p>読み込み中…</p>`;

  try {
    const response = await fetch('./machines.json');
    const machines = await response.json();

    const filtered = machines
      .filter(machine => machine.genre === selectedGenre)
      .sort((a, b) => b.year - a.year);

    displayMachines(filtered);
  } catch (err) {
    console.error('データ取得エラー', err);
    resultElm.innerHTML = `<p style="color: red;">データの読み込み中にエラーが発生しました。</p>`;
  }
}

// 名前検索
async function searchByName() {
  const resultElm = document.getElementById('result');
  const keyword = document.getElementById('nameInput').value.trim().toLowerCase();

  if (!keyword) {
    resultElm.innerHTML = `<p style="color: red;">検索ワードを入力してください。</p>`;
    return;
  }

  resultElm.innerHTML = `<p>読み込み中…</p>`;

  try {
    const response = await fetch('./machines.json');
    const machines = await response.json();

    const filtered = machines
      .filter(machine => machine.name.toLowerCase().includes(keyword))
      .sort((a, b) => b.year - a.year);

    displayMachines(filtered, keyword);
  } catch (err) {
    console.error('データ取得エラー', err);
    resultElm.innerHTML = `<p style="color: red;">データの読み込み中にエラーが発生しました。</p>`;
  }
}

// 結果を描画
function displayMachines(machines, keyword = '') {
  const resultElm = document.getElementById('result');

  if (machines.length === 0) {
    resultElm.innerHTML = keyword
      ? `<p>「${keyword}」に一致する機種はありませんでした。</p>`
      : `<p>該当する機種はありませんでした。</p>`;
    return;
  }

  resultElm.innerHTML = `<p>検索結果：${machines.length}件</p>`;

  const html = machines.map(machine => `
    <div class="machine-card">
      <a href="${machine.url}" target="_blank" class="machine-link">
        <div class="machine">
          <img class="machine-img" src="${machine.image}" alt="${machine.name}" onerror="this.src='img/noimage.jpg'" />
          <h3>${machine.name}</h3>
          <p>${machine.genre} / ${machine.manufacturer} / ${machine.year}年</p>
        </div>
      </a>
    </div>
  `).join('');

  resultElm.innerHTML += html;
}
