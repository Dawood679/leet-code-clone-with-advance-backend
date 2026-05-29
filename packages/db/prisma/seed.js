require('dotenv').config({ path: '../../../.env' });
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const problems = [
  {
    title: 'Two Sum',
    slug: 'two-sum',
    difficulty: 'EASY',
    description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
    constraints: `- 2 <= nums.length <= 10^4
- -10^9 <= nums[i] <= 10^9
- -10^9 <= target <= 10^9
- Only one valid answer exists.`,
    examples: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].' },
      { input: 'nums = [3,2,4], target = 6', output: '[1,2]' },
      { input: 'nums = [3,3], target = 6', output: '[0,1]' }
    ],
    testCases: [
      { input: '2 7 11 15\n9', expectedOutput: '0 1' },
      { input: '3 2 4\n6', expectedOutput: '1 2' },
      { input: '3 3\n6', expectedOutput: '0 1' }
    ],
    tags: ['Array', 'Hash Table']
  },
  {
    title: 'Reverse Linked List',
    slug: 'reverse-linked-list',
    difficulty: 'EASY',
    description: `Given the head of a singly linked list, reverse the list, and return the reversed list.`,
    constraints: `- The number of nodes in the list is the range [0, 5000].
- -5000 <= Node.val <= 5000`,
    examples: [
      { input: 'head = [1,2,3,4,5]', output: '[5,4,3,2,1]' },
      { input: 'head = [1,2]', output: '[2,1]' },
      { input: 'head = []', output: '[]' }
    ],
    testCases: [
      { input: '1 2 3 4 5', expectedOutput: '5 4 3 2 1' },
      { input: '1 2', expectedOutput: '2 1' },
      { input: '', expectedOutput: '' }
    ],
    tags: ['Linked List', 'Recursion']
  },
  {
    title: 'Valid Parentheses',
    slug: 'valid-parentheses',
    difficulty: 'EASY',
    description: `Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
    constraints: `- 1 <= s.length <= 10^4
- s consists of parentheses only '()[]{}'.`,
    examples: [
      { input: 's = "()"', output: 'true' },
      { input: 's = "()[]{}"', output: 'true' },
      { input: 's = "(]"', output: 'false' }
    ],
    testCases: [
      { input: '()', expectedOutput: 'true' },
      { input: '()[]{}', expectedOutput: 'true' },
      { input: '(]', expectedOutput: 'false' },
      { input: '([)]', expectedOutput: 'false' },
      { input: '{[]}', expectedOutput: 'true' }
    ],
    tags: ['String', 'Stack']
  },
  {
    title: 'Maximum Subarray',
    slug: 'maximum-subarray',
    difficulty: 'MEDIUM',
    description: `Given an integer array \`nums\`, find the subarray with the largest sum, and return its sum.`,
    constraints: `- 1 <= nums.length <= 10^5
- -10^4 <= nums[i] <= 10^4`,
    examples: [
      { input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: '6', explanation: 'The subarray [4,-1,2,1] has the largest sum 6.' },
      { input: 'nums = [1]', output: '1' },
      { input: 'nums = [5,4,-1,7,8]', output: '23' }
    ],
    testCases: [
      { input: '-2 1 -3 4 -1 2 1 -5 4', expectedOutput: '6' },
      { input: '1', expectedOutput: '1' },
      { input: '5 4 -1 7 8', expectedOutput: '23' }
    ],
    tags: ['Array', 'Dynamic Programming', 'Divide and Conquer']
  },
  {
    title: 'Climbing Stairs',
    slug: 'climbing-stairs',
    difficulty: 'EASY',
    description: `You are climbing a staircase. It takes \`n\` steps to reach the top.

Each time you can either climb \`1\` or \`2\` steps. In how many distinct ways can you climb to the top?`,
    constraints: `- 1 <= n <= 45`,
    examples: [
      { input: 'n = 2', output: '2', explanation: 'There are two ways to climb to the top: 1 step + 1 step, or 2 steps.' },
      { input: 'n = 3', output: '3', explanation: 'There are three ways: 1+1+1, 1+2, 2+1.' }
    ],
    testCases: [
      { input: '2', expectedOutput: '2' },
      { input: '3', expectedOutput: '3' },
      { input: '5', expectedOutput: '8' },
      { input: '10', expectedOutput: '89' }
    ],
    tags: ['Math', 'Dynamic Programming', 'Memoization']
  }
];

async function main() {
  console.log('Seeding database...');

  for (const p of problems) {
    await prisma.problem.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        title: p.title,
        slug: p.slug,
        difficulty: p.difficulty,
        description: p.description,
        constraints: p.constraints,
        examples: p.examples,
        testCases: p.testCases,
        tags: p.tags
      }
    });
    console.log(`  Upserted: ${p.title}`);
  }

  console.log('Done!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
