import bot from "./assets/bot.svg";
import user from "./assets/user.svg";

const apiURL = `https://openailive.onrender.com` || `http://localhost:5000`;
const form = document.querySelector("form");
const chatContainer = document.querySelector("#chat_container");

let loadInterval;

function loader(element) {
  element.textContent = "";

  loadInterval = setInterval(() => {
    element.textContent += ".";

    if (element.textContext === "....") {
      element.textContent = "";
    }
  }, 300);

  // clear the interval before starting a new one
  //clearInterval(loadInterval);
}
function typeText(element, text) {
  let index = 0;
  let interval = setInterval(() => {
    if (index < text.length) {
      element.innerHTML += text.charAt(index);
      index++;
    } else {
      clearInterval(interval);
    }
  }, 20);
}

function generateUniqueid() {
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);

  return `id-${timestamp}-${hexadecimalString}`;
}

function ChatSpace(isAi, value, uniqueId) {
  return `
    <div class="wrapper ${isAi && "ai"}">
      <div class="chat">
        <div class="profile">
          <img  
            src="${isAi ? bot : user}"
            alt ="${isAi ? "bot" : "user"}"
          /> 

        </div>
        <div class = "message" id =${uniqueId}>
          ${value}
        </div>
      </div>
    <div>

    `;
}

const handelSubmit = async (e) => {
  e.preventDefault();

  const data = new FormData(form);

  // user's ChatSpace
  chatContainer.innerHTML += ChatSpace(false, data.get("prompt"));

  form.reset();
  // bot's ChatSpace
  const uniqueId = generateUniqueid();
  chatContainer.innerHTML += ChatSpace(true, " ", uniqueId);

  // put new message in view
  chatContainer.scrollTop = chatContainer.scrollHeight;

  const messageDiv = document.getElementById(uniqueId);

  loader(messageDiv);
  // fetch data from server -> bot's responsee
  //http://localhost:5000/
  const response = await fetch(`${apiURL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: data.get("prompt"),
    }),
  });
  clearInterval(loadInterval);
  messageDiv.innerHTML = "";

  if (response.ok) {
    const data = await response.json();
    const parsedData = data.bot.trim();

    console.log({ parsedData });

    typeText(messageDiv, parsedData);
  } else {
    const err = await response.text();
    messageDiv.innerHTML = "Somting will wrong!";
    alert("Error");
  }
};

form.addEventListener("submit", handelSubmit);
form.addEventListener("keyup", (e) => {
  if (e.keyCode === 13) {
    handelSubmit(e);
  }
});
