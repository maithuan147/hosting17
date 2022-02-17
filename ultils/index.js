
//This function round by 1st decimal place if neccessary
export const roundNumber = (num) => {
    return Math.round((num + Number.EPSILON) * 10) / 10 || 0
}