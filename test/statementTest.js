const test = require('ava');
const {statement} = require('../src/statement');

const invoice = {
  'customer': 'BigCo',
  'performances': [
    {
      'playID': 'hamlet',
      'audience': 55,
    },
    {
      'playID': 'as-like',
      'audience': 35,
    },
    {
      'playID': 'othello',
      'audience': 40,
    },
  ],
};


const plays = {
  'hamlet': {
    'name': 'Hamlet',
    'type': 'tragedy',
  },
  'as-like': {
    'name': 'As You Like It',
    'type': 'comedy',
  },
  'othello': {
    'name': 'Othello',
    'type': 'tragedy',
  },
};

test('should return 0 earn and 0 owed when statement given no performances', t => {
  //given
  const invoice = {
    'customer': 'BigCo',
    'performances': [],
  };
  //when
  const result = statement(invoice,plays);
  const expectResult = `Statement for BigCo\n`+
                      `Amount owed is $0.00\n`+
                       `You earned 0 credits \n`;
  //then
  t.is(result,expectResult);
});

test('should return 0 earned and 650 owed when statement given hamlet and 30 audience', t => {
  //given
  const invoice = {
      'customer': 'BigCo',
      'performances': [
        {
          'playID': 'hamlet',
          'audience': 30,
        },
      ],
    };
  //when
   const result = statement(invoice, plays);
  //then
   t.is(result, 'Statement for BigCo\n' +
      ' Hamlet: $400.00 (30 seats)\n' +
      'Amount owed is $400.00\n' +
      'You earned 0 credits \n');
})
