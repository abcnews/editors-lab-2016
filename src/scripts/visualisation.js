var NUMBER_DELIMITER_PATTERN = /(\d)(?=(\d{3})+(?!\d))/g;

function visualisation(el, maxValue) {

    function update(value) {
        el.innerHTML = value.toString().replace(NUMBER_DELIMITER_PATTERN, '$1' + ',');
    }

    update(maxValue); // ?

    return update;
}

module.exports = visualisation;
