const container = document.getElementById("container");
const medicineBox1 = document.getElementById("medicine-box-1");
const medicineBox2 = document.getElementById("medicine-box-2");
const braceletId = document
    .getElementById("bracelet")
    .getAttribute("data-bracelet-id");

const tempalte = (data) => {
    return `
    <div class="box-weight bg-main-color-1 m-3 rounded-16"> 
        <div class="weight-number p-1 d-flex align-items-center justify-content-center">
            <div class="text-gram d-flex align-items-end">
                <h6 class="fw-regular weight-med fw-semibold text-secondary-color-1 me-1"> ${data.weight}  </h6>
                <h6 class="fw-regular fw-semibold text-secondary-color-1 mb-2"> Gr </h6>
            </div>
        </div>
        <a href="options/${data.id}" class="button-box bg-main-color-3 rounded-16 p-3 d-flex align-items-center justify-content-between">
            <h6 class="fw-regular text-center text-secondary-color-1"> ${data.name} </h6>
            <img src="/img/Icon.svg" alt="">
        </a>
    </div>
    `;
};

const loadSmartBoxCard = (data, medicineBox) => {
    medicineBox.childNodes[1].childNodes[1].childNodes[1].textContent =
        data.weight;
    medicineBox.childNodes[3].setAttribute("href", `options/${data.id}`);
    medicineBox.childNodes[3].childNodes[1].textContent = data.name;
};

const loadData = (data) => {
    document.getElementById("temp").textContent =
        data.smartBracelet.temperature;
    if (data.smartBox.sensorBox[0].name == "Box 1") {
        loadSmartBoxCard(data.smartBox.sensorBox[0], medicineBox1);
    } else {
        loadSmartBoxCard(data.smartBox.sensorBox[1], medicineBox1);
    }

    if (data.smartBox.sensorBox[1].name == "Box 2") {
        loadSmartBoxCard(data.smartBox.sensorBox[1], medicineBox2);
    } else {
        loadSmartBoxCard(data.smartBox.sensorBox[0], medicineBox2);
    }
};
generalDataLoader({ url: "api/v1/smartmedicine/detail", func: loadData });

const socket = io();
socket.on("connect", (s) => {});
socket.on(`/temp/${braceletId}`, (data) => {
    document.getElementById("temp").textContent = data;
});
