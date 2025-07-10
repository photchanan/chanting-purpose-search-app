async function loadChants() {
  const response = await fetch('chants.json');
  const chants = await response.json();
  return chants;
}

function debounce(func, delay) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}

async function searchByPurpose() {
  const query = document.getElementById("purposeSearch").value.trim().toLowerCase();
  const resultsEl = document.getElementById("chantResults");
  resultsEl.innerHTML = "";

  if (!query) return;

  const chants = await loadChants();
  const results = chants.filter(chant =>
    chant.purpose.some(purpose => purpose.toLowerCase().includes(query))
  );

  if (results.length === 0) {
    resultsEl.innerHTML = "<li>ไม่พบบทสวดที่ตรงกับจุดประสงค์</li>";
    return;
  }

  results.forEach(chant => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${chant.title}</strong><br><small>วัตถุประสงค์: ${chant.purpose.join(", ")}</small>`;
    li.style.cursor = "pointer";
    li.onclick = () => showChantContent(chant);
    resultsEl.appendChild(li);
  });
}

function showChantContent(chant) {
  const chantContainer = document.getElementById("chantContainer");
  chantContainer.innerHTML = `
    <h3>${chant.title}</h3>
    <p>${chant.content.th}</p>
    <hr>
    <p><em>${chant.content.en}</em></p>
  `;
  chantContainer.scrollTop = 0;
}

document.getElementById("purposeSearch")
  .addEventListener("input", debounce(searchByPurpose, 300));
