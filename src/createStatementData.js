function calculateTotalAmount(invoice, plays) {
    let totalAmount = 0;
    for (let perf of invoice.performances) {
        const play = plays[perf.playID];
        const thisAmount = calculateAmount(play, perf);
        totalAmount += thisAmount;
    }
    return totalAmount;
}

function calculateAmount(play, perf) {
    let amountStrategy = {
        'tragedy': () => getAmountOfTragedy(perf),
        'comedy': () => getAmountOfComedy(perf)
    }
    return amountStrategy[play.type] == undefined ? throwUnknownException(play) : amountStrategy[play.type](perf);
}

function throwUnknownException(play) {
    throw new Error(`unknown type: ${play.type}`);
}

function getAmountOfComedy(perf) {
    let thisAmount = 30000;
    if (perf.audience > 20) {
        thisAmount += 10000 + 500 * (perf.audience - 20);
    }
    thisAmount += 300 * perf.audience;
    return thisAmount;
}

function getAmountOfTragedy(perf) {
    let thisAmount = 40000;
    if (perf.audience > 30) {
        thisAmount += 1000 * (perf.audience - 30);
    }
    return thisAmount;
}
function calculateVolumeCredits(invoice, plays) {
    let volumeCredits = 0;
    for (let perf of invoice.performances) {
        const play = plays[perf.playID];
        volumeCredits += caculateCredit(perf, play);
    }
    return volumeCredits;
}

function caculateCredit(perf, play) {
    let credit = 0;
    credit += Math.max(perf.audience - 30, 0);
    if ('comedy' === play.type)
        credit += Math.floor(perf.audience / 5);
    return credit;
}
function createStatementData(invoice, play) {
    let customer = invoice.customer;
    let totalAmount = calculateTotalAmount(invoice, play);
    let volumeCredits = calculateVolumeCredits(invoice, play);
    let performances = invoice.performances;
    let data = {
        plays:play,
        invoice:invoice,
        customer:customer,
        totalAmount: totalAmount,
        volumeCredits: volumeCredits,
        performances: performances
    }
    return data;
}

module.exports = {
    createStatementData,
};