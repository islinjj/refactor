const { createStatementData } = require("./createStatementData");

function statement(invoice, plays) {
  return generateResult(createStatementData(invoice, plays));
}
function generateResult(data) {
  let result = `Statement for ${data.customer}\n`;
  result = generatePerformResult(data, result);
  result += `Amount owed is ${formatUsd(data.totalAmount)}\n`;
  result += `You earned ${data.volumeCredits} credits \n`;
  return result;
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

function generatePerformResult(data, result) {
  for (let perf of data.performances) {
    const play = data.plays[perf.playID];
    const thisAmount = calculateAmount(play, perf);
    result += ` ${play.name}: ${formatUsd(thisAmount)} (${perf.audience} seats)\n`;
  }
  return result;
}

function formatUsd(amount) {
  const format = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format;
  return format(amount / 100);
}

module.exports = {
  statement,
};

