export const DIFFICULTY_LEVELS = ['Easy', 'Medium', 'Hard'] as const
export type Difficulty = typeof DIFFICULTY_LEVELS[number]
export const isDifficulty = (d: string): d is Difficulty => DIFFICULTY_LEVELS.includes(d as Difficulty)

export const PLATFORMS = ['LeetCode', 'HackerRank', 'CodeChef', 'Custom'] as const
export type Platform = typeof PLATFORMS[number]
export const isPlatform = (p: string): p is Platform => PLATFORMS.includes(p as Platform)

export const TOPICS = [
  'Array', 'String', 'Linked List', 'Stack', 'Queue',
  'Tree', 'Binary Search Tree', 'Heap', 'Graph', 'Dynamic Programming',
  'Recursion', 'Backtracking', 'Greedy', 'Sliding Window', 'Two Pointers',
  'Binary Search', 'Sorting', 'Hashing', 'Math', 'Bit Manipulation',
] as const
export type Topic = typeof TOPICS[number]

export const PROBLEM_STATUS = ['todo', 'solved', 'attempted', 'skipped'] as const
export type ProblemStatus = typeof PROBLEM_STATUS[number]
export const toProblemStatus = (s: string): ProblemStatus => PROBLEM_STATUS.includes(s as ProblemStatus) ? s as ProblemStatus : 'todo'

export const DIFFICULTY_COLOR: Record<Difficulty, string> = {
  Easy: 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/20',
  Medium: 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-900/20',
  Hard: 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20',
}

// ─── Code Execution ───────────────────────────────────────────

export const SUPPORTED_LANGUAGES = [
  { id: 63,  name: 'JavaScript', extension: 'js',   monacoLang: 'javascript' },
  { id: 71,  name: 'Python',     extension: 'py',   monacoLang: 'python'     },
  { id: 62,  name: 'Java',       extension: 'java', monacoLang: 'java'       },
  { id: 54,  name: 'C++',        extension: 'cpp',  monacoLang: 'cpp'        },
  { id: 73,  name: 'Rust',       extension: 'rs',   monacoLang: 'rust'       },
] as const

export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number]
export type LanguageId        = SupportedLanguage['id']

export const DEFAULT_LANGUAGE_ID: LanguageId = 63 // JavaScript

export const LANGUAGE_BY_ID = Object.fromEntries(
  SUPPORTED_LANGUAGES.map((l) => [l.id, l])
) as Record<LanguageId, SupportedLanguage>

export const STARTER_CODE: Record<number, string> = {
  63: `// JavaScript
function solution(input) {
  // Write your solution here

}

// Read input and call solution
const lines = require('fs').readFileSync('/dev/stdin','utf8').trim().split('\\n')
console.log(solution(lines))`,

  71: `# Python
import sys

def solution(lines):
    # Write your solution here
    pass

lines = sys.stdin.read().strip().split('\\n')
print(solution(lines))`,

  62: `// Java
import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Write your solution here

    }
}`,

  54: `// C++
#include <bits/stdc++.h>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    // Write your solution here

    return 0;
}`,

  73: `// Rust
use std::io::{self, Read};

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    
    // Write your solution here
    
}`,
}

// Judge0 status codes
export const JUDGE0_STATUS: Record<number, { label: string; color: string }> = {
  1:  { label: 'In Queue',           color: 'text-slate-400'   },
  2:  { label: 'Processing',         color: 'text-amber-400'   },
  3:  { label: 'Accepted',           color: 'text-emerald-400' },
  4:  { label: 'Wrong Answer',       color: 'text-rose-400'    },
  5:  { label: 'Time Limit',         color: 'text-amber-400'   },
  6:  { label: 'Compilation Error',  color: 'text-rose-400'    },
  7:  { label: 'Runtime Error',      color: 'text-rose-400'    },
  8:  { label: 'Runtime Error',      color: 'text-rose-400'    },
  9:  { label: 'Runtime Error',      color: 'text-rose-400'    },
  10: { label: 'Runtime Error',      color: 'text-rose-400'    },
  11: { label: 'Runtime Error',      color: 'text-rose-400'    },
  12: { label: 'Runtime Error',      color: 'text-rose-400'    },
  13: { label: 'Internal Error',     color: 'text-rose-400'    },
  14: { label: 'Exec Format Error',  color: 'text-rose-400'    },
}
