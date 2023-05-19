const modifyContainer = document.getElementById("modify-container");
// Jika Terdapat Data Di Database Maka Ubah Tampila Form
const formDetail = (data) => {
    if (data === null) return;
    frequency.value = data.reminder_type;
    reminderId.setAttribute("data-id", data.id);

    xTimeDay.style.display = "none";
    everyXDay.style.display = "none";
    everyXWeek.style.display = "none";
    daySchedule.style.display = "none";
    weekSchedule.style.display = "none";

    if (data.reminder_type === "X_TIME_DAY") {
        xTimeDay.style.display = "block";
        daySchedule.style.display = "block";

        // Set Another Value
        medicineName.value = data.name;
        startDate.value = data.startDate.split("T")[0];
        finishDate.value = data.finishDate.split("T")[0];
        // console.log(data.time);
        const times = data.time.split(",");
        scheduleCount = times.length - 1;
        times.forEach((time, i) => {
            xTimeDayArray[i].value = time.split(" ")[4];
            xTimeDayArray[i].setAttribute("data-select", "true");
            xTimeDayArray[i].parentElement.classList.remove("hidden");
            if (i == times.length - 1) {
                xTimeDayArray[i].parentElement.childNodes[3].classList.remove(
                    "hidden"
                );
            }
        });

        modifyContainer.classList.remove("hidden");
        addButtton.classList.add("hidden");
    }

    if (data.reminder_type === "EVERY_X_DAY") {
        everyXDay.style.display = "block";
        weekSchedule.style.display = "block";
    }

    if (data.reminder_type === "EVERY_X_WEEK") {
        everyXWeek.style.display = "block";
        weekSchedule.style.display = "block";
    }
};

generalDataLoader({
    url: `/api/v1/smartbox/reminder/${sensorBoxID}`,
    func: formDetail,
});
