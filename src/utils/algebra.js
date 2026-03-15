/**
 * Generates medium-to-hard algebra problems.
 * Format: ax + b = cx + d, or a(x + b) = cx + d, etc.
 */

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function gcd(a, b) {
  return b === 0 ? a : gcd(b, a % b);
}

export function generateAlgebraProblem() {
  const type = randInt(1, 4);
  let problem, answer;

  switch (type) {
    case 1: {
      // ax + b = c  (simple)
      const a = randInt(2, 9);
      const c = randInt(5, 20);
      let b = randInt(-15, 15);
      if (b === 0) b = randInt(1, 10);
      answer = (c - b) / a;
      problem = `${a}x ${b >= 0 ? '+' : ''} ${b} = ${c}`;
      break;
    }
    case 2: {
      // ax + b = cx + d  (variables on both sides)
      const a = randInt(2, 6);
      const c = randInt(1, 5);
      if (a === c) {
        return generateAlgebraProblem(); // avoid degenerate case
      }
      const x = randInt(-10, 10);
      const b = randInt(-12, 12);
      const d = a * x + b - c * x;
      answer = x;
      problem = `${a}x ${b >= 0 ? '+' : ''} ${b} = ${c}x ${d >= 0 ? '+' : ''} ${d}`;
      break;
    }
    case 3: {
      // a(x + b) = c
      const a = randInt(2, 6);
      const b = randInt(-5, 5);
      const x = randInt(-8, 8);
      const c = a * (x + b);
      answer = x;
      problem = `${a}(x ${b >= 0 ? '+' : ''} ${b}) = ${c}`;
      break;
    }
    case 4: {
      // (ax + b) / c = d
      const c = randInt(2, 5);
      const d = randInt(2, 10);
      const a = randInt(1, 4);
      const b = randInt(-8, 8);
      const x = (d * c - b) / a;
      if (!Number.isInteger(x) || Math.abs(x) > 20) {
        return generateAlgebraProblem();
      }
      answer = x;
      problem = `(${a}x ${b >= 0 ? '+' : ''} ${b}) / ${c} = ${d}`;
      break;
    }
    default:
      return generateAlgebraProblem();
  }

  // Ensure answer is clean
  if (!Number.isFinite(answer) || Math.abs(answer) > 50) {
    return generateAlgebraProblem();
  }

  return {
    problem: problem.replace(/\s+/g, ' '),
    answer: Math.round(answer * 100) / 100,
  };
}
