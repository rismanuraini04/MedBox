const container = document.getElementById("container");
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
const fetchData = async () => {
    const resp = await httpRequest({
        url: "api/v1/smartmedicine/detail",
        method: "GET",
    });
    resp.data.smartBox.sensorBox.forEach((data) => {
        container.insertAdjacentHTML("afterbegin", tempalte(data));
    });

    document.getElementById("temp").textContent =
        resp.data.smartBracelet.temperature;
};

fetchData();

const socket = io();
socket.on("connect", (s) => {});
socket.on(`/temp/${braceletId}`, (data) => {
    document.getElementById("temp").textContent = data;
});
