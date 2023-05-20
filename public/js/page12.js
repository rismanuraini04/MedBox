const sensorBoxId = window.location.href.split("/").at(-1); //get sensor box id from url
const historyContainer = document.getElementById("history-container");
const ICON = {
    ONTIME: "/img/check.svg",
    LATE: "/img/cross.svg",
};

const historyTemplate = (data) => {
    return `
    <div class="bg-secondary-color-2 p-4 rounded-9 d-flex justify-content-between align-items-center mt-4">
        <div>
            <img src="/img/obat.svg" alt="">
        </div>
        <div>
            <h5 class="fw-regular weight-med fw-bold text-secondary-color-4"> ${data.schedule
                .split("@")
                .at(-1)} </h5>
            <p class="fw-regular weight-med fw-light text-secondary-color-4 text-secondary-color-2 m-0"> ${data.schedule
                .split("@")
                .at(0)} </p>
            <p class="fw-regular weight-med fw-light text-secondary-color-4 text-secondary-color-2 m-0"> ${days(
                data.createdAt
            )} </p>
        </div>
        <div>
            <img src="${ICON[data.status]}" alt="">
        </div>
    </div>
    `;
};

const historyHandler = (data) => {
    data.forEach((d) =>
        historyContainer.insertAdjacentHTML("beforeend", historyTemplate(d))
    );
};
generalDataLoader({
    url: `/api/v1/smartbox/reminder/history/?sensorBoxId=${sensorBoxId}`,
    func: historyHandler,
});
