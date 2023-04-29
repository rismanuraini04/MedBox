const crypto = require("crypto");
class Scheduler {
    static #SCHEDULER_LIST = {};

    /**
     * Function that will call the given function at the specified time.
     * @name setTask
     * @param {Date} date `date` a Date object or a string that can be passed to the Date constructor.
     * @param {Function} fn `fn` Function to execute at the specified time.
     * @returns {String} Returns a string ID that can be use to cancel the task.
     */
    static setTask = function (date, fn) {
        const id = crypto.randomUUID();
        if (typeof fn !== "function") {
            throw new Error("expected second argument to be a function");
        }

        date = new Date(date);
        var now = new Date();
        var ms = date - now;
        var timer = setTimeout(fn, ms);
        Scheduler.#SCHEDULER_LIST[id] = { timer: timer };
        return id;
    };

    /**
     * Showing All Task List
     * @returns {Object} Objek of task
     */
    static getTask = function () {
        return Scheduler.#SCHEDULER_LIST;
    };

    static removeTask = function (id) {
        const task = Scheduler.#SCHEDULER_LIST[id];
        if (task == undefined) {
            console.log("Task ID Cant Be Find");
            return;
        }
        clearTimeout(task.timer);
    };
}

module.exports = Scheduler;
