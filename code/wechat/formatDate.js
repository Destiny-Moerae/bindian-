
/**
 * Formats a Unix timestamp into a date string in the format YYYY-MM-DD.
 * 
 * @param {number} unixTimestamp - The Unix timestamp to format.
 * @return {string} The formatted date string.
 */
function formatDate(unixTimestamp) {
    const date = new Date(unixTimestamp * 1000); // 将秒转换为毫秒

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，所以要加1，并确保两位数
    const day = String(date.getDate()).padStart(2, '0'); // 确保两位数

    return `${year}-${month}-${day}`;
}

module.exports = { formatDate };