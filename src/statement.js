function statement(invoice, plays) {
  let totalAmount = getTotalAmount(invoice, plays);
  let volumeCredits = 0;
  let result = `Statement for ${invoice.customer}\n`;
  result = getLineResult(invoice, plays, result);
  result += `Amount owed is ${formatUsd(totalAmount)}\n`;
  volumeCredits = getVolumeCredits(invoice, plays, volumeCredits);
  result += `You earned ${volumeCredits} credits \n`;
  return result;
}
function getTotalAmount(invoice, plays) {
  let totalAmount = 0;
  for (let perf of invoice.performances) {
    const play = plays[perf.playID];
    const thisAmount = getAmount(play, perf);
    totalAmount += thisAmount;
  }
  return totalAmount;
}

function getAmount(play, perf) {
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

function getLineResult(invoice, plays, result) {
  for (let perf of invoice.performances) {
    const play = plays[perf.playID];
    const thisAmount = getAmount(play, perf);
    result += ` ${play.name}: ${formatUsd(thisAmount)} (${perf.audience} seats)\n`;
  }
  return result;
}

function getVolumeCredits(invoice, plays, volumeCredits) {
  for (let perf of invoice.performances) {
    const play = plays[perf.playID];
    volumeCredits += getCredit(perf, play);
  }
  return volumeCredits;
}

function getCredit(perf, play) {
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

