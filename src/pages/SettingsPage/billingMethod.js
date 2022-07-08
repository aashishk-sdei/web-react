const getDateMethod = (date) => {
    const _date1 = new Date(date);
    return `${_date1.getDate()} ${_date1.toLocaleString('default', { month: 'short' })} ${_date1.getFullYear()}`
}
export const getRenewDate = (billingInfo) => {
    if(!billingInfo) return null
    return billingInfo.renewalDate? getDateMethod(billingInfo.renewalDate): "N/A"
}