// DEPRECATION NOTICE
// The credit and one-time purchase system is deprecated in favor of a single $1.99/month Premium plan
// managed centrally via Mumapps-Auth. Do not introduce new usages of getCreditCost or getDiscountText.
// These helpers remain only to support archived/legacy UI (e.g., old ManageAccount page).
// TODO: Remove after full removal of legacy one-time purchase UI.

const capitalize = (word) => {
    if (typeof word !== 'string') return '';
    return word.charAt(0).toUpperCase() + word.slice(1);
}

/**
 * @deprecated Use centralized subscription. Credits are no longer sold.
 */
const getCreditCost = (credits) => {
    // Courses are $4.99 per credit.
    // 10% discount if 5 or more, 20% if 10 or more, 40% if 50 or more
    const cost = 4.99 * credits;
    let discount = 1;
    if (credits >= 50) discount = 0.6;
    else if (credits >= 10) discount = 0.8;
    else if (credits >= 5) discount = 0.9;
    return (cost*discount).toFixed(2);
}

/**
 * @deprecated Use centralized subscription. Credits are no longer sold.
 */
const getDiscountText = (credits) => {
    if (credits >= 50) return '-40% discount';
    else if (credits >= 10) return '-20% discount';
    else if (credits >= 5) return '-10% discount';
    return '';
}



export default { capitalize, getCreditCost, getDiscountText};