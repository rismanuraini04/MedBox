const modifyContainer = document.getElementById("modify-container");
// Jika Terdapat Data Di Database Maka Ubah Tampila Form
const formDetail = (data) => {
    if (data === null) return;
    frequency.value = data.reminder_type;

    xTimeDay.style.display = "none";
    everyXDay.style.display = "none";
    everyXWeek.style.display = "none";
    daySchedule.style.display = "none";
    weekSchedule.style.display = "none";

    if (data.reminder_type === "X_TIME_DAY") {
        xTimeDay.style.display = "block";
        daySchedule.style.display = "block";

        // Set Another Value
        startDate.value = data.startDate.split("T")[0];
        finishDate.value = data.finishDate.split("T")[0];
        const times = data.time.split(",");
        xTimeDay_1.value = times[0].split(" ")[4];
        xTimeDay_2.value = times[1].split(" ")[4];
        xTimeDay_3.value = times[2].split(" ")[4];
        xTimeDay_4.value = times[3].split(" ")[4];
        medicineName.value = data.name;

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
