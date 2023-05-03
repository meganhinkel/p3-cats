const searchBox = document.getElementById('top-search');
const title = document.getElementById("main-title");
const lead = document.querySelector(".lead");
const findCatButton = document.getElementById("findCat");
const findZip = document.getElementById("zip-search");

const req = new XMLHttpRequest();
req.withCredentials = true;
const data = null;
let searchData = null;

searchBox.onsubmit = (ev) => {
  console.log('submitted top-search with', ev)
  // https://stackoverflow.com/a/26892365/1449799
  const formData = new FormData(ev.target)
  console.log(formData)
  for (const pair of formData.entries()) {
    searchData = (`${pair[1]}`);
    title.innerText = searchData;
    lead.innerText = " ";
    console.log(searchData);
    const url = 'https://catbreeddb.p.rapidapi.com/?search=';
    req.open("GET", `${url}${searchData}`);
    req.setRequestHeader('content-type', 'application/octet-stream');
    req.setRequestHeader('X-RapidAPI-Key', 'dd4653624cmsh93ac643bffa670fp13e3d0jsn93d6c3c9bc74');
    req.setRequestHeader('X-RapidAPI-Host', 'catbreeddb.p.rapidapi.com');
    req.send(data);
  }
  ev.preventDefault()
}


const infoList = document.createElement("dl");
lead.insertAdjacentElement("afterend", infoList);

req.addEventListener("load", function (ev) {
  const catData = JSON.parse(ev.target.responseText);
  // Check if breed exists in database first
  if (catData.length == 0) {
    while (infoList.firstChild) {
      infoList.removeChild(infoList.lastChild);
    }
    const notFound = document.createElement("dt");
    notFound.innerHTML = "Breed not found";
    infoList.appendChild(notFound);
  } else {
  findCatButton.classList.remove("hidden");
  findCatButton.classList.add("eachBreed");
  findZip.classList.remove("hidden");
  findZip.classList.add("visible");
  while (linkList.firstChild) {
    linkList.removeChild(linkList.lastChild);
  }
  console.log(catData);
  const info = catData[0];
  while (infoList.firstChild) {
    infoList.removeChild(infoList.lastChild);
  }
  for (let key in info) {
    if (key != "id") {
    if (key == "imgThumb") {
      const infoTitle = document.createElement("dt");
      infoTitle.innerHTML = "Image";
      const infoDesc = document.createElement("dd");
      const catPic = document.createElement("img");
      catPic.src = info[key];
      infoDesc.appendChild(catPic);
      infoList.append(infoTitle, infoDesc);
    } else {
       const infoTitle = document.createElement("dt");
       infoTitle.innerHTML = key;
       const infoDesc = document.createElement("dd");
       infoDesc.innerHTML = info[key];
       infoList.append(infoTitle, infoDesc);
    }
  }
}
  }
});

findCatButton.addEventListener('click', (ev) => {
  while (linkList.firstChild){
    linkList.removeChild(linkList.lastChild);
  }
  console.log("meow");
  const requestCatPromise = fetch('https://api.petfinder.com/v2/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials&client_id=RATKNJUq80egucxLBtjmrqExfGy1C2CBPyimuHNovy4VXp4miK&client_secret=llDxu3P6aws0d36L0Xese3UQdX2Umh5xWhLN2GOH'
  });
  requestCatPromise
    .then(processRespAsJSON)
    .then(getAccessKey)
    .then(requestAnimals);
});

const processRespAsJSON = (resp) => {
  console.log('processing response 1');
  const data = resp.json();
  return data;  
}

const getAccessKey = (jsonResp) => {
  console.log(jsonResp);
  const access_token = jsonResp.access_token;
  return access_token;
}

const requestAnimals = (access_token) => {
  console.log(searchData);
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  const requestAnimalPromise = fetch(`https://api.petfinder.com/v2/animals?type=cat&breed=${capitalizeFirstLetter(searchData)}&location=${zipCode}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${access_token}`
    },
   });
   requestAnimalPromise
    .then(processRespAsJSON)
    .then(linkToAnimal)
    .catch(() => {
      linkList.appendChild(document.createTextNode("No cats of this breed available nearby"));
    });
}

let zipCode = "22801";
findZip.onsubmit = (ev) => {
  ev.preventDefault();
  console.log('submitted zip search with', ev);
  const formData = new FormData(ev.target)
  console.log(formData)
  for (const pair of formData.entries()) {
    zipCode = (`${pair[1]}`);
    console.log(zipCode);
  }
}

const linkList = document.createElement("ul");
findCatButton.insertAdjacentElement("afterend", linkList);

const linkToAnimal = (jsonResp) => {
  const foundCats = jsonResp.animals;
  console.log(foundCats);
  foundCats.forEach(element => {
    console.log(element.url);
    const listItem = document.createElement("li");
    let anchor = document.createElement("a");
    let linkTest = document.createTextNode(element.name);
    anchor.appendChild(linkTest); 
    anchor.href = element.url;
    listItem.appendChild(anchor);
    linkList.appendChild(listItem);
  });
  if (foundCats.length == 0) {
    linkList.appendChild(document.createTextNode("No cats of this breed available nearby"));
  }
};
