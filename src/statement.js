function statement(invoice, plays) {
  let totalAmount = calculateTotalAmount(invoice, plays);
  let volumeCredits = calculateVolumeCredits(invoice, plays);
  let result = generateResult(invoice, plays, totalAmount, volumeCredits);
  return result;
}
function generateResult(invoice, plays, totalAmount, volumeCredits) {
  let result = `Statement for ${invoice.customer}\n`;
  result = generateLineResult(invoice, plays, result);
  result += `Amount owed is ${formatUsd(totalAmount)}\n`;
  result += `You earned ${volumeCredits} credits \n`;
  return result;
}

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
  switch (play.type) {
    case 'tragedy':
      thisAmount = 40000;
      if (perf.audience > 30) {
        thisAmount += 1000 * (perf.audience - 30);
      }
      break;
    case 'comedy':
      thisAmount = 30000;
      if (perf.audience > 20) {
        thisAmount += 10000 + 500 * (perf.audience - 20);
      }
      thisAmount += 300 * perf.audience;
      break;
    default:
      throw new Error(`unknown type: ${play.type}`);
  }
  return thisAmount;
}

function generateLineResult(invoice, plays, result) {
  for (let perf of invoice.performances) {
    const play = plays[perf.playID];
    const thisAmount = calculateAmount(play, perf);
    result += ` ${play.name}: ${formatUsd(thisAmount)} (${perf.audience} seats)\n`;
  }
  return result;
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

