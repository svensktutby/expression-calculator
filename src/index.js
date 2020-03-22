function eval() {
    // Do not use eval!!!
    return;
}

function expressionCalculator(expr) {
  const methods = {
    '-': (a, b) => a - b,
    '+': (a, b) => a + b,
    '*': (a, b) => a * b,
    '/': (a, b) => a / b
  };
  
  const priority = {
    '(': 0,
    ')': 0,
    '-': 1,
    '+': 1,
    '*': 2,
    '/': 2
  };

  const singleStringArray = expr.replace(/\s/g, '').split('');
  const expressionArray = [];
  const numbers = [];
  const operations = [];

  for (let i = 0; i < singleStringArray.length; i++) {
    if (!isNaN(+singleStringArray[i])) {
      let number = singleStringArray[i];

      while (!isNaN(singleStringArray[i+1])) {
        number += singleStringArray[i+1];
        i++;
      }

      expressionArray.push(+number);
    } else {
      expressionArray.push(singleStringArray[i]);
    }
  }

  const getCharLength = (arr, char) => arr.filter(item => item === char).length;
  const isDivisionByZero = !!expressionArray
    .filter(item => item !== '(' && item !== ')')
    .find((item, index, arr) => item === '/' && arr[index + 1] === 0);

  if (getCharLength(expressionArray, '(') !== getCharLength(expressionArray, ')')) {
    throw new Error('ExpressionError: Brackets must be paired');
  }
  
  if (isDivisionByZero) {
    throw new Error('TypeError: Division by zero.');
  }

  const calc = () => {
    const operation = operations.pop();
    const lastNum = numbers.pop();
    const penultNum = numbers.pop();
    const resultNum = methods[operation](penultNum, lastNum);
    numbers.push(resultNum);
  };

  for (const item of expressionArray) {
    let operationsTop = operations[operations.length - 1];

    if (!isNaN(item)) {
      numbers.push(item);
      continue;
    }

    if (isNaN(item)) {
      if (!operations.length ||
        item === '(' ||
        priority[item] > priority[operationsTop]) {
          operations.push(item);
          continue;
      }

      while (true) {
        operationsTop = operations[operations.length - 1];
        if (item === ')' && operationsTop === '(') {
          operations.pop();
          break;
        }

        if (operationsTop === '(') {
          operations.push(item);
          break;
        }

        if (priority[item] <= priority[operationsTop]) {
          calc();
        } else {
          operations.push(item);
          break;
        }
      }
    }
  }

  for (let i = 0; i < operations.length; i++) {
    calc();
    i--;
  }

  return numbers[0];
}

module.exports = {
    expressionCalculator
}