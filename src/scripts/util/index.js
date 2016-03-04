var NUMBER_DELIMITER_PATTERN = /(\d)(?=(\d{3})+(?!\d))/g;

module.exports = {
    formatNumber: function (number) {
        return number.toString().replace(NUMBER_DELIMITER_PATTERN, '$1' + ',');
    }
};
