-- Insert initial topics
INSERT INTO public.topics (id, name, slug, icon) VALUES
(1, 'Arrays & Hashing', 'arrays-and-hashing', 'box'),
(2, 'Two Pointers', 'two-pointers', 'arrows-right-left'),
(3, 'Sliding Window', 'sliding-window', 'app-window'),
(4, 'Stack', 'stack', 'layers'),
(5, 'Binary Search', 'binary-search', 'search'),
(6, 'Linked List', 'linked-list', 'link'),
(7, 'Trees', 'trees', 'network'),
(8, 'Tries', 'tries', 'binary-tree'),
(9, 'Heap / Priority Queue', 'heap-priority-queue', 'arrow-up-down'),
(10, 'Backtracking', 'backtracking', 'corner-up-left'),
(11, 'Graphs', 'graphs', 'git-commit'),
(12, 'Advanced Graphs', 'advanced-graphs', 'share-2'),
(13, '1-D Dynamic Programming', '1d-dynamic-programming', 'activity'),
(14, '2-D Dynamic Programming', '2d-dynamic-programming', 'grid'),
(15, 'Greedy', 'greedy', 'coins'),
(16, 'Intervals', 'intervals', 'calendar-range'),
(17, 'Math & Geometry', 'math-and-geometry', 'calculator'),
(18, 'Bit Manipulation', 'bit-manipulation', 'cpu')
ON CONFLICT (id) DO NOTHING;

-- Reset sequence for topics
SELECT setval('public.topics_id_seq', (SELECT MAX(id) FROM public.topics));

-- Insert sample problems
INSERT INTO public.problems (id, title, platform, difficulty, topic_id, topic_name, link, is_must_do, description) VALUES
(gen_random_uuid(), 'Contains Duplicate', 'LeetCode', 'Easy', 1, 'Arrays & Hashing', 'https://leetcode.com/problems/contains-duplicate/', true, 'Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.'),
(gen_random_uuid(), 'Valid Anagram', 'LeetCode', 'Easy', 1, 'Arrays & Hashing', 'https://leetcode.com/problems/valid-anagram/', true, 'Given two strings s and t, return true if t is an anagram of s, and false otherwise.'),
(gen_random_uuid(), 'Two Sum', 'LeetCode', 'Easy', 1, 'Arrays & Hashing', 'https://leetcode.com/problems/two-sum/', true, 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.'),
(gen_random_uuid(), 'Group Anagrams', 'LeetCode', 'Medium', 1, 'Arrays & Hashing', 'https://leetcode.com/problems/group-anagrams/', false, 'Given an array of strings strs, group the anagrams together. You can return the answer in any order.'),
(gen_random_uuid(), 'Top K Frequent Elements', 'LeetCode', 'Medium', 1, 'Arrays & Hashing', 'https://leetcode.com/problems/top-k-frequent-elements/', true, 'Given an integer array nums and an integer k, return the k most frequent elements. You may return the answer in any order.'),

(gen_random_uuid(), 'Valid Palindrome', 'LeetCode', 'Easy', 2, 'Two Pointers', 'https://leetcode.com/problems/valid-palindrome/', true, 'A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.'),
(gen_random_uuid(), '3Sum', 'LeetCode', 'Medium', 2, 'Two Pointers', 'https://leetcode.com/problems/3sum/', true, 'Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.'),
(gen_random_uuid(), 'Container With Most Water', 'LeetCode', 'Medium', 2, 'Two Pointers', 'https://leetcode.com/problems/container-with-most-water/', false, 'You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]). Find two lines that together with the x-axis form a container, such that the container contains the most water.')
;
