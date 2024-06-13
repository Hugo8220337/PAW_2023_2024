var Condition = require("../models/condition");

/**
 * 
 * @param {*} insertedItems 
 * @returns pontos que os items merecem
 */
async function calculatePoints(insertedItems) {

    let totalPoints = 0;
    for (let item of insertedItems) {
        const condition = await Condition.findById(item.conditionId);
        if (condition) {
            totalPoints += item.weight * condition.pointsPerKg;
        }
    }

    return totalPoints
}

module.exports = calculatePoints;