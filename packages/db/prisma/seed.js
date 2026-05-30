const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const problems = [
  {
    title: 'Two Sum',
    slug: 'two-sum',
    difficulty: 'EASY',
    description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have **exactly one solution**, and you may not use the same element twice.

You can return the answer in any order.`,
    constraints: `- \`2 <= nums.length <= 10^4\`
- \`-10^9 <= nums[i] <= 10^9\`
- \`-10^9 <= target <= 10^9\`
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
    tags: ['Array', 'Hash Table'],
    starterCode: {
      python: `import sys
input = sys.stdin.readline

def twoSum(nums, target):
    # Write your solution here
    # Return a list of two indices
    pass

# --- Read Input ---
nums = list(map(int, input().split()))
target = int(input())

# --- Output ---
result = twoSum(nums, target)
print(result[0], result[1])
`,
      javascript: `const lines = require('fs').readFileSync('/dev/stdin','utf8').trim().split('\\n');
const nums = lines[0].split(' ').map(Number);
const target = Number(lines[1]);

function twoSum(nums, target) {
    // Write your solution here
    // Return an array of two indices
}

const result = twoSum(nums, target);
console.log(result[0] + ' ' + result[1]);
`,
      java: `import java.util.*;

public class Solution {
    static int[] twoSum(int[] nums, int target) {
        // Write your solution here
        // Return array of two indices
        return new int[]{};
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String[] parts = sc.nextLine().trim().split("\\\\s+");
        int[] nums = Arrays.stream(parts).mapToInt(Integer::parseInt).toArray();
        int target = Integer.parseInt(sc.nextLine().trim());

        int[] res = twoSum(nums, target);
        System.out.println(res[0] + " " + res[1]);
    }
}
`,
      cpp: `#include <bits/stdc++.h>
using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
    // Write your solution here
    // Return vector of two indices
    return {};
}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    string line;
    getline(cin, line);
    istringstream iss(line);
    vector<int> nums;
    int x;
    while (iss >> x) nums.push_back(x);

    int target;
    cin >> target;

    vector<int> res = twoSum(nums, target);
    cout << res[0] << " " << res[1] << endl;
    return 0;
}
`
    },
    solutions: {
      python: `import sys
input = sys.stdin.readline

def twoSum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []

nums = list(map(int, input().split()))
target = int(input())
result = twoSum(nums, target)
print(result[0], result[1])
`,
      javascript: `const lines = require('fs').readFileSync('/dev/stdin','utf8').trim().split('\\n');
const nums = lines[0].split(' ').map(Number);
const target = Number(lines[1]);

function twoSum(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) return [map.get(complement), i];
        map.set(nums[i], i);
    }
}

const result = twoSum(nums, target);
console.log(result[0] + ' ' + result[1]);
`,
      java: `import java.util.*;

public class Solution {
    static int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) return new int[]{map.get(complement), i};
            map.put(nums[i], i);
        }
        return new int[]{};
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String[] parts = sc.nextLine().trim().split("\\\\s+");
        int[] nums = Arrays.stream(parts).mapToInt(Integer::parseInt).toArray();
        int target = Integer.parseInt(sc.nextLine().trim());
        int[] res = twoSum(nums, target);
        System.out.println(res[0] + " " + res[1]);
    }
}
`,
      cpp: `#include <bits/stdc++.h>
using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> seen;
    for (int i = 0; i < nums.size(); i++) {
        int complement = target - nums[i];
        if (seen.count(complement)) return {seen[complement], i};
        seen[nums[i]] = i;
    }
    return {};
}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    string line;
    getline(cin, line);
    istringstream iss(line);
    vector<int> nums;
    int x;
    while (iss >> x) nums.push_back(x);
    int target;
    cin >> target;
    vector<int> res = twoSum(nums, target);
    cout << res[0] << " " << res[1] << endl;
    return 0;
}
`
    }
  },
  {
    title: 'Reverse Linked List',
    slug: 'reverse-linked-list',
    difficulty: 'EASY',
    description: `Given the head of a singly linked list, reverse the list, and return the reversed list.

**Note:** In this problem, the linked list is represented as a space-separated sequence of integers. Reverse the sequence and print it.`,
    constraints: `- The number of nodes is in the range \`[0, 5000]\`
- \`-5000 <= Node.val <= 5000\``,
    examples: [
      { input: 'head = [1,2,3,4,5]', output: '[5,4,3,2,1]' },
      { input: 'head = [1,2]', output: '[2,1]' },
      { input: 'head = []', output: '[]' }
    ],
    testCases: [
      { input: '1 2 3 4 5', expectedOutput: '5 4 3 2 1' },
      { input: '1 2', expectedOutput: '2 1' },
      { input: '1', expectedOutput: '1' }
    ],
    tags: ['Linked List', 'Recursion'],
    starterCode: {
      python: `import sys
input = sys.stdin.readline

def reverseList(vals):
    # vals is a list of integers
    # Return reversed list
    pass

# --- Read Input ---
line = input().strip()
vals = list(map(int, line.split())) if line else []

# --- Output ---
result = reverseList(vals)
print(*result)
`,
      javascript: `const line = require('fs').readFileSync('/dev/stdin','utf8').trim();
const vals = line ? line.split(' ').map(Number) : [];

function reverseList(vals) {
    // vals is an array of integers
    // Return reversed array
}

const result = reverseList(vals);
console.log(result.join(' '));
`,
      java: `import java.util.*;

public class Solution {
    static int[] reverseList(int[] vals) {
        // vals is an array of integers
        // Return reversed array
        return new int[]{};
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String line = sc.hasNextLine() ? sc.nextLine().trim() : "";
        int[] vals = line.isEmpty() ? new int[0]
            : Arrays.stream(line.split("\\\\s+")).mapToInt(Integer::parseInt).toArray();

        int[] res = reverseList(vals);
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < res.length; i++) {
            if (i > 0) sb.append(' ');
            sb.append(res[i]);
        }
        System.out.println(sb);
    }
}
`,
      cpp: `#include <bits/stdc++.h>
using namespace std;

vector<int> reverseList(vector<int>& vals) {
    // vals is a vector of integers
    // Return reversed vector
    return {};
}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    string line;
    getline(cin, line);
    istringstream iss(line);
    vector<int> vals;
    int x;
    while (iss >> x) vals.push_back(x);

    vector<int> res = reverseList(vals);
    for (int i = 0; i < res.size(); i++) {
        if (i) cout << ' ';
        cout << res[i];
    }
    cout << endl;
    return 0;
}
`
    },
    solutions: {
      python: `import sys
input = sys.stdin.readline

def reverseList(vals):
    return vals[::-1]

line = input().strip()
vals = list(map(int, line.split())) if line else []
result = reverseList(vals)
print(*result)
`,
      javascript: `const line = require('fs').readFileSync('/dev/stdin','utf8').trim();
const vals = line ? line.split(' ').map(Number) : [];

function reverseList(vals) {
    return vals.reverse();
}

const result = reverseList(vals);
console.log(result.join(' '));
`,
      java: null,
      cpp: null
    }
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
    constraints: `- \`1 <= s.length <= 10^4\`
- \`s\` consists of parentheses only \`'()[]{}'.\``,
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
    tags: ['String', 'Stack'],
    starterCode: {
      python: `import sys
input = sys.stdin.readline

def isValid(s):
    # s is a string of brackets: ()[]{}
    # Return True or False
    pass

# --- Read Input ---
s = input().strip()

# --- Output ---
print(str(isValid(s)).lower())
`,
      javascript: `const s = require('fs').readFileSync('/dev/stdin','utf8').trim();

function isValid(s) {
    // s is a string of brackets: ()[]{}
    // Return true or false
}

console.log(isValid(s));
`,
      java: `import java.util.*;

public class Solution {
    static boolean isValid(String s) {
        // s is a string of brackets: ()[]{}
        // Return true or false
        return false;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.nextLine().trim();
        System.out.println(isValid(s));
    }
}
`,
      cpp: `#include <bits/stdc++.h>
using namespace std;

bool isValid(string s) {
    // s is a string of brackets: ()[]{}
    // Return true or false
    return false;
}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    string s;
    getline(cin, s);
    cout << (isValid(s) ? "true" : "false") << endl;
    return 0;
}
`
    },
    solutions: {
      python: `import sys
input = sys.stdin.readline

def isValid(s):
    stack = []
    mapping = {')': '(', '}': '{', ']': '['}
    for char in s:
        if char in mapping:
            top = stack.pop() if stack else '#'
            if mapping[char] != top:
                return False
        else:
            stack.append(char)
    return not stack

s = input().strip()
print(str(isValid(s)).lower())
`,
      javascript: `const s = require('fs').readFileSync('/dev/stdin','utf8').trim();

function isValid(s) {
    const stack = [];
    const map = { ')': '(', '}': '{', ']': '[' };
    for (const c of s) {
        if (map[c]) {
            if (stack.pop() !== map[c]) return false;
        } else {
            stack.push(c);
        }
    }
    return stack.length === 0;
}

console.log(isValid(s));
`,
      java: null,
      cpp: null
    }
  },
  {
    title: 'Maximum Subarray',
    slug: 'maximum-subarray',
    difficulty: 'MEDIUM',
    description: `Given an integer array \`nums\`, find the **subarray** with the largest sum, and return its sum.

A **subarray** is a contiguous non-empty sequence of elements within an array.`,
    constraints: `- \`1 <= nums.length <= 10^5\`
- \`-10^4 <= nums[i] <= 10^4\``,
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
    tags: ['Array', 'Dynamic Programming', 'Divide and Conquer'],
    starterCode: {
      python: `import sys
input = sys.stdin.readline

def maxSubArray(nums):
    # nums is a list of integers
    # Return the maximum subarray sum (integer)
    pass

# --- Read Input ---
nums = list(map(int, input().split()))

# --- Output ---
print(maxSubArray(nums))
`,
      javascript: `const nums = require('fs').readFileSync('/dev/stdin','utf8').trim().split(' ').map(Number);

function maxSubArray(nums) {
    // nums is an array of integers
    // Return the maximum subarray sum
}

console.log(maxSubArray(nums));
`,
      java: `import java.util.*;

public class Solution {
    static int maxSubArray(int[] nums) {
        // nums is an array of integers
        // Return the maximum subarray sum
        return 0;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String[] parts = sc.nextLine().trim().split("\\\\s+");
        int[] nums = Arrays.stream(parts).mapToInt(Integer::parseInt).toArray();
        System.out.println(maxSubArray(nums));
    }
}
`,
      cpp: `#include <bits/stdc++.h>
using namespace std;

int maxSubArray(vector<int>& nums) {
    // nums is a vector of integers
    // Return the maximum subarray sum
    return 0;
}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    string line;
    getline(cin, line);
    istringstream iss(line);
    vector<int> nums;
    int x;
    while (iss >> x) nums.push_back(x);
    cout << maxSubArray(nums) << endl;
    return 0;
}
`
    },
    solutions: {
      python: `import sys
input = sys.stdin.readline

def maxSubArray(nums):
    # Kadane's Algorithm
    maxSum = nums[0]
    currentSum = nums[0]
    for num in nums[1:]:
        currentSum = max(num, currentSum + num)
        maxSum = max(maxSum, currentSum)
    return maxSum

nums = list(map(int, input().split()))
print(maxSubArray(nums))
`,
      javascript: `const nums = require('fs').readFileSync('/dev/stdin','utf8').trim().split(' ').map(Number);

function maxSubArray(nums) {
    let maxSum = nums[0], cur = nums[0];
    for (let i = 1; i < nums.length; i++) {
        cur = Math.max(nums[i], cur + nums[i]);
        maxSum = Math.max(maxSum, cur);
    }
    return maxSum;
}

console.log(maxSubArray(nums));
`,
      java: null,
      cpp: null
    }
  },
  {
    title: 'Climbing Stairs',
    slug: 'climbing-stairs',
    difficulty: 'EASY',
    description: `You are climbing a staircase. It takes \`n\` steps to reach the top.

Each time you can either climb \`1\` or \`2\` steps. In how many distinct ways can you climb to the top?`,
    constraints: `- \`1 <= n <= 45\``,
    examples: [
      { input: 'n = 2', output: '2', explanation: 'There are two ways: 1 step + 1 step, or 2 steps.' },
      { input: 'n = 3', output: '3', explanation: '1+1+1, 1+2, 2+1.' }
    ],
    testCases: [
      { input: '2', expectedOutput: '2' },
      { input: '3', expectedOutput: '3' },
      { input: '5', expectedOutput: '8' },
      { input: '10', expectedOutput: '89' }
    ],
    tags: ['Math', 'Dynamic Programming', 'Memoization'],
    starterCode: {
      python: `import sys
input = sys.stdin.readline

def climbStairs(n):
    # n is an integer (1 <= n <= 45)
    # Return the number of distinct ways to climb n stairs
    pass

# --- Read Input ---
n = int(input())

# --- Output ---
print(climbStairs(n))
`,
      javascript: `const n = parseInt(require('fs').readFileSync('/dev/stdin','utf8').trim());

function climbStairs(n) {
    // n is an integer (1 <= n <= 45)
    // Return the number of distinct ways to climb n stairs
}

console.log(climbStairs(n));
`,
      java: `import java.util.*;

public class Solution {
    static int climbStairs(int n) {
        // n is an integer (1 <= n <= 45)
        // Return the number of distinct ways
        return 0;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = Integer.parseInt(sc.nextLine().trim());
        System.out.println(climbStairs(n));
    }
}
`,
      cpp: `#include <bits/stdc++.h>
using namespace std;

int climbStairs(int n) {
    // n is an integer (1 <= n <= 45)
    // Return the number of distinct ways
    return 0;
}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    int n;
    cin >> n;
    cout << climbStairs(n) << endl;
    return 0;
}
`
    },
    solutions: {
      python: `import sys
input = sys.stdin.readline

def climbStairs(n):
    if n <= 2:
        return n
    a, b = 1, 2
    for _ in range(3, n + 1):
        a, b = b, a + b
    return b

n = int(input())
print(climbStairs(n))
`,
      javascript: `const n = parseInt(require('fs').readFileSync('/dev/stdin','utf8').trim());

function climbStairs(n) {
    if (n <= 2) return n;
    let a = 1, b = 2;
    for (let i = 3; i <= n; i++) [a, b] = [b, a + b];
    return b;
}

console.log(climbStairs(n));
`,
      java: null,
      cpp: null
    }
  }
];

async function main() {
  console.log('Seeding database...');
  for (const p of problems) {
    await prisma.problem.upsert({
      where: { slug: p.slug },
      update: {
        starterCode: p.starterCode,
        solutions: p.solutions
      },
      create: {
        title: p.title,
        slug: p.slug,
        difficulty: p.difficulty,
        description: p.description,
        constraints: p.constraints,
        examples: p.examples,
        testCases: p.testCases,
        tags: p.tags,
        starterCode: p.starterCode,
        solutions: p.solutions
      }
    });
    console.log(`  Upserted: ${p.title}`);
  }
  console.log('Done!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
