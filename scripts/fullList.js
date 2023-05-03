let fullBreedList = document.getElementById("fullBreedList");
let currentBreed = document.getElementById("currentBreed");

const reqList = new XMLHttpRequest();
reqList.withCredentials = true;
const listBreeds = null;

reqList.open('GET', 'https://catbreeddb.p.rapidapi.com/');
reqList.setRequestHeader('content-type', 'application/octet-stream');
reqList.setRequestHeader('X-RapidAPI-Key', 'dd4653624cmsh93ac643bffa670fp13e3d0jsn93d6c3c9bc74');
reqList.setRequestHeader('X-RapidAPI-Host', 'catbreeddb.p.rapidapi.com');
reqList.send(listBreeds);

reqList.addEventListener("load", function (ev) {
    const catData = JSON.parse(ev.target.responseText);
    console.log(catData);
    catData.forEach(element => {
        const catButton = document.createElement("button");
        catButton.classList.add("eachBreed");
        catButton.innerText = element.breedName;
        catButton.addEventListener("click", function (ev) {
            // clear current breed first        
            while (currentBreed.firstChild) {
                currentBreed.removeChild(currentBreed.lastChild);
            }
            while (linkList.firstChild){
                linkList.removeChild(linkList.lastChild);
            }
            for (let key in element) {
                if (key != "id") {
                if (key == "imgThumb") {
                  const infoTitle = document.createElement("dt");
                  infoTitle.innerHTML = "Image";
                  const infoDesc = document.createElement("dd");
                  const catPic = document.createElement("img");
                  catPic.src = element[key];
                  infoDesc.appendChild(catPic);
                  currentBreed.append(infoTitle, infoDesc);
                } else {
                   const infoTitle = document.createElement("dt");
                   infoTitle.innerHTML = key;
                   const infoDesc = document.createElement("dd");
                   infoDesc.innerHTML = element[key];
                   currentBreed.append(infoTitle, infoDesc);
                }
              }
            }
            searchData = element.breedName;
            findCatButton.classList.remove("hidden");
            findCatButton.classList.add("visible");
            findZip.classList.remove("hidden");
            findZip.classList.add("visible");
         });
        fullBreedList.append(catButton);
    });
    
});  

