/* global moment */
// jscs: disable disallowSpacesInsideParentheses

const parseDateFormats = ['DD MMM YY @ HH:mm (UTC Z)', 'DD MMM YY HH:mm (UTC Z)',
                          'D MMM YY @ HH:mm (UTC Z)', 'D MMM YY HH:mm (UTC Z)',
                          'DD MMM YYYY @ HH:mm (UTC Z)', 'DD MMM YYYY HH:mm (UTC Z)',
                          'D MMM YYYY @ HH:mm (UTC Z)', 'D MMM YYYY HH:mm (UTC Z)',
                          'DD/MM/YY @ HH:mm (UTC Z)', 'DD/MM/YY HH:mm (UTC Z)',
                          'DD/MM/YYYY @ HH:mm (UTC Z)', 'DD/MM/YYYY HH:mm (UTC Z)',
                          'DD-MM-YY @ HH:mm (UTC Z)', 'DD-MM-YY HH:mm (UTC Z)',
                          'DD-MM-YYYY @ HH:mm (UTC Z)', 'DD-MM-YYYY HH:mm (UTC Z)',
                          'YYYY-MM-DD @ HH:mm (UTC Z)', 'YYYY-MM-DD HH:mm (UTC Z)',
                          'DD MMM @ HH:mm (UTC Z)', 'DD MMM HH:mm (UTC Z)',
                          'D MMM @ HH:mm (UTC Z)', 'D MMM HH:mm (UTC Z)'];

const displayDateFormat = 'DD MMM YY @ HH:mm (UTC Z)';

// Add missing timestamps
function verifyTimeStamp(dateString) {
    if (dateString && !dateString.slice(-5).match(/\d+:\d\d/)) {
        dateString += ' 12:00';
    }
    return dateString;
}

// Parses a string to a Moment
function parseDateString(value) {
    return value ? moment.utc(verifyTimeStamp(value), parseDateFormats, true) : undefined;
}

// Formats a Date or Moment
function formatDate(value) {
    return verifyTimeStamp(value ? moment(value).format(displayDateFormat) : '');
}

export {
    parseDateString,
    formatDate
};
