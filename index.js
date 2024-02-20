import dictionary from "./conditions.js";

// глобальные переменные
const header = document.querySelector(".header");
const form = document.querySelector(".form");
const input = document.querySelector(".input");

function removeCard() {
  const prevCard = document.querySelector(".card");
  if (prevCard) prevCard.remove();
}
function addCard({ name, country, temp_c, condition, imgPath }) {
  const card = `<div class="card">
                            <div class="card-info">
                            <h2 class="card-city">${name}<span class="card-country">${country}</span></h2>
                    
                            <h2 class="card-num-of-C">${temp_c} °c</h2>
                            
                            <h2 class="card-conditions">${condition}</h2>
                            </div>
                            <img src="${imgPath}" alt="(" class="card-icon">
                        </div>`;

  header.insertAdjacentHTML("afterend", card);
}
async function getWeather(city) {
  const apiKey = "afe364b2771544e6add64557242002";
  const query = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;
  const response = await fetch(query);
  const data = await response.json();
  return data;
}

form.onsubmit = async function (e) {
  e.preventDefault();
  const city = input.value.trim();
  const data = await getWeather(city);
  if (data.error) {
    alert(data.error.message);
  } else {
    removeCard();

    const code = dictionary.find(
      (obj) => obj.code === data.current.condition.code
    );

    const filePath = "./img/" + (data.current.is_day ? "day" : "night") + "/";
    const fileName = (data.current.is_day ? code.day : code.night) + ".png";
    const imgPath = filePath + fileName;
    console.log(imgPath);
    const cardInfo = {
      name: data.location.name,
      country: data.location.country,
      temp_c: data.current.temp_c,
      condition: data.current.is_day ? code.day : code.night,
      imgPath,
    };
    addCard(cardInfo);
  }
};
