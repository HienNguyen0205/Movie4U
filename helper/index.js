const helper = {
    convertTime: function (time) {
        if (time.match(/^\d{2}:\d{2}$/)) {
            // Add seconds component ":00"
            return time + ':00';
        } else {
            return time;
        }

    }
}

module.exports = helper;