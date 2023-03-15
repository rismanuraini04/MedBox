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

numberControl("interval-number-control");
numberControl("reminder-number-control");
