const numberControl = (id) => {
    let number = 0;
    const container = document.getElementById(id);
    container.childNodes[1].addEventListener("click", (e) => {
        if (number > 0) number -= 1;
        container.childNodes[3].value = number;
        e.preventDefault();
    });
    container.childNodes[5].addEventListener("click", (e) => {
        number += 1;
        container.childNodes[3].value = number;
        e.preventDefault();
    });
};

numberControl("week-interval-number-control");
numberControl("days-interval-number-control");
numberControl("reminder-number-control");

const xTimeDay = document.getElementById("x-times-day");
const everyXDay = document.getElementById("every-x-day");
const everyXWeek = document.getElementById("every-x-week");
const frequency = document.getElementById("frequency");
const daySchedule = document.getElementById("day-schedule");
const weekSchedule = document.getElementById("week-schedule");
let frequencyType = frequency.value;

const updateFrequency = () => {
    xTimeDay.style.display = "none";
    everyXDay.style.display = "none";
    everyXWeek.style.display = "none";
    daySchedule.style.display = "none";
    weekSchedule.style.display = "none";

    if (frequencyType === "xTimeDay") {
        xTimeDay.style.display = "block";
        daySchedule.style.display = "block";
    }

    if (frequencyType === "everyXDay") {
        everyXDay.style.display = "block";
        weekSchedule.style.display = "block";
    }

    if (frequencyType === "everyXWeek") {
        everyXWeek.style.display = "block";
        weekSchedule.style.display = "block";
    }
};

updateFrequency();

frequency.addEventListener("change", (e) => {
    e.preventDefault();
    frequencyType = frequency.value;
    updateFrequency();
});

//INFO: Handling ketika user memilih X Time A Day
const button = document.getElementById("btn");
const xTimeDay_1 = document.querySelectorAll(".times-picker")[0];
const xTimeDay_2 = document.querySelectorAll(".times-picker")[1];
const xTimeDay_3 = document.querySelectorAll(".times-picker")[2];
const xTimeDay_4 = document.querySelectorAll(".times-picker")[3];
const startDate = document.getElementById("startDate");
const finishDate = document.getElementById("finishDate");

button.addEventListener("click", (e) => {
    e.preventDefault();
    httpRequest({
        url: "/api/v1/smartbox/reminder",
        body: {
            sensorBoxID: "clfxk22ff0001soggt6q2m5nb",
            startDate: startDate.value,
            finishDate: finishDate.value,
            interval: "0",
            times: [
                xTimeDay_1.value,
                xTimeDay_2.value,
                xTimeDay_3.value,
                xTimeDay_4.value,
            ],
            reminder_type: "X_TIME_DAY",
            reminder_before: "",
            reminder_after: "",
        },
    });
});
