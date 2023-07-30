const sensorBoxId = window.location.href.split("/").at(-1); //get sensor box id from url
const historyContainer = document.getElementById("history-container");
const loadMore = document.getElementById("loadMore");
const ICON = {
    ONTIME: "/img/check.svg",
    LATE: "/img/cross.svg",
    NOT_TAKEN: "/img/cross.svg",
};

const historyTemplate = (data, server_time_zone) => {
    return `
    <div class="history bg-secondary-color-2 p-4 rounded-9 d-flex justify-content-between align-items-center mt-4" data-id="${
        data.id
    }">
        <div>
            <img src="/img/obat.svg" alt="">
        </div>
        <div>
            <h5 class="fw-regular weight-med fw-bold text-secondary-color-4"> ${data.schedule
                .split("@")
                .at(-1)} </h5>
            <p class="fw-regular weight-med fw-light text-secondary-color-4 text-secondary-color-2 m-0"> ${data.schedule
                .split("@")
                .at(0)} ${data.status == "NOT_TAKEN" ? "is not taken" : ""} </p>
            <p class="fw-regular weight-med fw-light text-secondary-color-4 text-secondary-color-2 m-0"> ${days(
                timeAdjusment(
                    new Date(data.createdAt),
                    server_time_zone,
                    Intl.DateTimeFormat().resolvedOptions().timeZone
                )
            )} </p>
        </div>
        <div>
            <img src="${ICON[data.status]}" alt="">
        </div>
    </div>
    `;
};

const historyHandler = (data) => {
    data.history.forEach((d) =>
        historyContainer.insertAdjacentHTML(
            "beforeend",
            historyTemplate(d, data.server_time_zone)
        )
    );
};
generalDataLoader({
    url: `/api/v1/smartbox/reminder/history/?sensorBoxId=${sensorBoxId}`,
    func: historyHandler,
});
loadMore.addEventListener("click", (e) => {
    e.preventDefault();
    const lastId = lastCursorFinder("history", "data-id");
    generalDataLoader({
        url: `/api/v1/smartbox/reminder/history/?sensorBoxId=${sensorBoxId}&cursor=${lastId}`,
        func: historyHandler,
    });
});
