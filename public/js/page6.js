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

// INFO: Control Form Sliding
numberControl("week-interval-number-control");
numberControl("days-interval-number-control");
numberControl("reminder-number-control");

const TIME_ZONE = Intl.DateTimeFormat().resolvedOptions().timeZone;
const xTimeDay = document.getElementById("x-times-day");
const everyXDay = document.getElementById("every-x-day");
const everyXWeek = document.getElementById("every-x-week");
const frequency = document.getElementById("frequency");
const daySchedule = document.getElementById("day-schedule");
const weekSchedule = document.getElementById("week-schedule");
const medicineName = document.getElementById("medicine");
const sensorBoxID = document.getElementById("box-id").getAttribute("data-id");
const reminderId = document.getElementById("reminder-id");
const scheduleBtn = document.getElementById("schedule-btn");
let frequencyType = frequency.value;
let scheduleCount = 0;

// Info: Control Form Appearance
const updateFrequency = () => {
    xTimeDay.style.display = "none";
    everyXDay.style.display = "none";
    everyXWeek.style.display = "none";
    daySchedule.style.display = "none";
    weekSchedule.style.display = "none";

    if (frequencyType === "X_TIME_DAY") {
        xTimeDay.style.display = "block";
        daySchedule.style.display = "block";
    }

    if (frequencyType === "EVERY_X_DAY") {
        everyXDay.style.display = "block";
        weekSchedule.style.display = "block";
    }

    if (frequencyType === "EVERY_X_WEEK") {
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
const addButtton = document.getElementById("add-btn");
const xTimeDayArray = document.querySelectorAll(".times-picker");
const xTimeDayVisibility = [true];
const xTimeDay_1 = document.querySelectorAll(".times-picker")[0];
const xTimeDay_2 = document.querySelectorAll(".times-picker")[1];
const xTimeDay_3 = document.querySelectorAll(".times-picker")[2];
const xTimeDay_4 = document.querySelectorAll(".times-picker")[3];
const startDate = document.getElementById("startDate");
const finishDate = document.getElementById("finishDate");

document.querySelectorAll(".times-picker").forEach((element, i) => {
    if (i > 0) {
        element.parentElement.childNodes[3].addEventListener("click", (e) => {
            element.parentElement.classList.add("hidden");
            xTimeDayArray[scheduleCount].setAttribute("data-select", "false");
            scheduleCount -= 1;
            if (scheduleCount > 0) {
                xTimeDayArray[
                    scheduleCount
                ].parentElement.childNodes[3].classList.remove("hidden");
            }
        });
    }
});

scheduleBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (scheduleCount < 3) {
        scheduleCount += 1;
        if (scheduleCount > 0) {
            xTimeDayArray[
                scheduleCount - 1
            ].parentElement.childNodes[3].classList.add("hidden");
        }
        xTimeDayArray[scheduleCount].parentElement.classList.remove("hidden");
        xTimeDayArray[
            scheduleCount
        ].parentElement.childNodes[3].classList.remove("hidden");
        xTimeDayArray[scheduleCount].setAttribute("data-select", "true");
    }
});

addButtton.addEventListener("click", async (e) => {
    e.preventDefault();
    const times = [];
    xTimeDayArray.forEach((d) => {
        if (d.getAttribute("data-select") === "true") {
            console.log(d.value);
            times.push(d.value);
        }
    });

    const resp = await httpRequest({
        url: "/api/v1/smartbox/reminder",
        body: {
            name: medicineName.value,
            sensorBoxID,
            startDate: startDate.value,
            finishDate: finishDate.value,
            interval: "0",
            times,
            reminder_type: "X_TIME_DAY",
            client_time_zone: TIME_ZONE,
        },
    });

    if (resp.success) {
        Swal.fire(resp.message).then((_) => {
            location.reload();
        });
    }
});

// INFO: Delete Reminder
const deleteButton = document.getElementById("delete-button");
deleteButton.addEventListener("click", async (e) => {
    e.preventDefault();
    Swal.fire({
        title: "Do you want to delete the reminder?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Delete",
        denyButtonText: `Don't delete`,
    }).then(async (result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
            const resp = await httpRequest({
                url: `/api/v1/smartbox/reminder/${reminderId.getAttribute(
                    "data-id"
                )}`,
                method: "DELETE",
            });
            if (resp.success) {
                Swal.fire("Delete Success!", "", "success").then((_) => {
                    location.reload();
                });
            }
        } else if (result.isDenied) {
            Swal.fire("Data not delete", "", "info");
        }
    });

    if (resp.success) {
        Swal.fire(resp.message);
        location.reload();
    }

    if (!resp.success) {
        alert("Failed to Delete Reminder");
    }
});

// INFO: Update Reminder
const updateButtton = document.getElementById("update-button");
updateButtton.addEventListener("click", async (e) => {
    e.preventDefault();
    const times = [];
    xTimeDayArray.forEach((d) => {
        if (d.getAttribute("data-select") === "true") {
            times.push(d.value);
        }
    });

    Swal.fire({
        title: "Are you sure to update the reminder?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Update",
        denyButtonText: `Don't update`,
    }).then(async (result) => {
        const resp = await httpRequest({
            url: "/api/v1/smartbox/reminder",
            body: {
                name: medicineName.value,
                reminderId: reminderId.getAttribute("data-id"),
                startDate: startDate.value,
                finishDate: finishDate.value,
                interval: "0",
                times,
                reminder_type: "X_TIME_DAY",
                client_time_zone: TIME_ZONE,
            },
            method: "PATCH",
        });

        if (resp.success) {
            Swal.fire(resp.message).then((_) => {
                location.reload();
            });
        }

        if (!resp.success) {
            Swal.fire(resp.message).then((_) => {
                location.reload();
            });
        }
    });
});
