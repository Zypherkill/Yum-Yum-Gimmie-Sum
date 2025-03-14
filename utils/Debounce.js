function debounce(funcName, timeoutInMs) {
    let timer;
    //... turns args = arguements(params) into an array
    return (...args) => {
        // if timer stops, apply the function
        if (!timer) {
            func.apply(this, args);
        }
        //clear timer, if the timer is still active
        clearTimeout(timer);
        timer = setTimeout(() => {
            timer = undefined;
        }, timeoutInMs);

    };
}


