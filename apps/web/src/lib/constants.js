export const LANGUAGES = [
  { value: 'python', label: 'Python 3', monacoLang: 'python' },
  { value: 'javascript', label: 'JavaScript', monacoLang: 'javascript' },
  { value: 'java', label: 'Java', monacoLang: 'java' },
  { value: 'cpp', label: 'C++', monacoLang: 'cpp' }
];

export const STARTER_CODE = {
  python: `# Write your solution here
def solution():
    pass
`,
  javascript: `// Write your solution here
function solution() {

}
`,
  java: `// Write your solution here
import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
    }
}
`,
  cpp: `// Write your solution here
#include <bits/stdc++.h>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    return 0;
}
`
};

export const STATUS_LABELS = {
  PENDING: 'Pending',
  PROCESSING: 'Judging...',
  ACCEPTED: 'Accepted',
  WRONG_ANSWER: 'Wrong Answer',
  TIME_LIMIT_EXCEEDED: 'Time Limit Exceeded',
  RUNTIME_ERROR: 'Runtime Error',
  COMPILE_ERROR: 'Compile Error'
};

export const STATUS_COLORS = {
  ACCEPTED: 'text-green-500',
  WRONG_ANSWER: 'text-red-500',
  TIME_LIMIT_EXCEEDED: 'text-yellow-500',
  RUNTIME_ERROR: 'text-red-500',
  COMPILE_ERROR: 'text-orange-500',
  PENDING: 'text-gray-400',
  PROCESSING: 'text-blue-400'
};
