# PS E:\ORG\Paikar-Software\EPS\backend> npx loadtest -n 10000 -c 25 -k http://localhost:4444/api/v1/owner
(node:7812) [DEP0060] DeprecationWarning: The `util._extend` API is deprecated. Please use Object.assign() instead.
(Use `node --trace-deprecation ...` to show where the warning was created)
(node:7560) [DEP0060] DeprecationWarning: The `util._extend` API is deprecated. Please use Object.assign() instead.
(Use `node --trace-deprecation ...` to show where the warning was created)
(node:22368) [DEP0060] DeprecationWarning: The `util._extend` API is deprecated. Please use Object.assign() instead.
(Use `node --trace-deprecation ...` to show where the warning was created)
(node:22576) [DEP0060] DeprecationWarning: The `util._extend` API is deprecated. Please use Object.assign() instead.
(Use `node --trace-deprecation ...` to show where the warning was created)
(node:18764) [DEP0060] DeprecationWarning: The `util._extend` API is deprecated. Please use Object.assign() instead.
(Use `node --trace-deprecation ...` to show where the warning was created)
Requests: 984 (39%), requests per second: 197, mean latency: 124 ms
Requests: 972 (39%), requests per second: 194, mean latency: 125.3 ms
Requests: 945 (38%), requests per second: 189, mean latency: 128.9 ms
Requests: 887 (35%), requests per second: 177, mean latency: 136.9 ms
Requests: 2024 (81%), requests per second: 208, mean latency: 119.2 ms
Requests: 1904 (76%), requests per second: 204, mean latency: 122.7 ms
Requests: 2026 (81%), requests per second: 211, mean latency: 117.7 ms
Requests: 1980 (79%), requests per second: 207, mean latency: 119.8 ms

Target URL:          http://localhost:4444/api/v1/owner
Max requests:        10000
Concurrent clients:  100
Running on cores:    4
Agent:               keepalive

Completed requests:  10000
Total errors:        0
Total time:          12.569 s
Mean latency:        122.8 ms
Effective rps:       796

Percentage of requests served within a certain time
  50%      114 ms
  90%      188 ms
  95%      229 ms
  99%      327 ms
 100%      600 ms (longest request)
# PS E:\ORG\Paikar-Software\EPS\backend> npx loadtest -n 20000 -c 25 -k http://localhost:4444/api/v1/owner
(node:21516) [DEP0060] DeprecationWarning: The `util._extend` API is deprecated. Please use Object.assign() instead.     
(Use `node --trace-deprecation ...` to show where the warning was created)
(node:10608) [DEP0060] DeprecationWarning: The `util._extend` API is deprecated. Please use Object.assign() instead.     
(Use `node --trace-deprecation ...` to show where the warning was created)
(node:9208) [DEP0060] DeprecationWarning: The `util._extend` API is deprecated. Please use Object.assign() instead.      
(Use `node --trace-deprecation ...` to show where the warning was created)
(node:368) [DEP0060] DeprecationWarning: The `util._extend` API is deprecated. Please use Object.assign() instead.       
(Use `node --trace-deprecation ...` to show where the warning was created)
(node:13792) [DEP0060] DeprecationWarning: The `util._extend` API is deprecated. Please use Object.assign() instead.     
(Use `node --trace-deprecation ...` to show where the warning was created)
Requests: 789 (16%), requests per second: 158, mean latency: 154 ms
Requests: 873 (17%), requests per second: 175, mean latency: 139.3 ms
Requests: 839 (17%), requests per second: 168, mean latency: 145.2 ms
Requests: 784 (16%), requests per second: 157, mean latency: 155.2 ms
Requests: 1993 (40%), requests per second: 224, mean latency: 111.7 ms
Requests: 1890 (38%), requests per second: 220, mean latency: 113.5 ms
Requests: 1964 (39%), requests per second: 225, mean latency: 110.5 ms
Requests: 1912 (38%), requests per second: 226, mean latency: 110 ms
Requests: 3229 (65%), requests per second: 247, mean latency: 100.5 ms
Requests: 3082 (62%), requests per second: 239, mean latency: 104.1 ms
Requests: 3190 (64%), requests per second: 245, mean latency: 101.3 ms
Requests: 3140 (63%), requests per second: 246, mean latency: 101.6 ms
Requests: 4409 (88%), requests per second: 236, mean latency: 104 ms
Requests: 4370 (87%), requests per second: 236, mean latency: 104.5 ms
Requests: 4237 (85%), requests per second: 230, mean latency: 106.4 ms
Requests: 4313 (86%), requests per second: 235, mean latency: 104.6 ms

Target URL:          http://localhost:4444/api/v1/owner
Max requests:        20000
Concurrent clients:  100
Running on cores:    4
Agent:               keepalive

Completed requests:  20000
Total errors:        0
Total time:          22.795 s
Mean latency:        112.1 ms
Effective rps:       877

Percentage of requests served within a certain time
  50%      102 ms
  90%      179 ms
  95%      211 ms
  99%      303 ms
 100%      599 ms (longest request)
# PS E:\ORG\Paikar-Software\EPS\backend> npx loadtest -n 20000 -c 30 -k http://localhost:4444/api/v1/owner
(node:19468) [DEP0060] DeprecationWarning: The `util._extend` API is deprecated. Please use Object.assign() instead.
(Use `node --trace-deprecation ...` to show where the warning was created)
(node:15000) [DEP0060] DeprecationWarning: The `util._extend` API is deprecated. Please use Object.assign() instead.
(Use `node --trace-deprecation ...` to show where the warning was created)
(node:22644) [DEP0060] DeprecationWarning: The `util._extend` API is deprecated. Please use Object.assign() instead.
(Use `node --trace-deprecation ...` to show where the warning was created)
(node:11988) [DEP0060] DeprecationWarning: The `util._extend` API is deprecated. Please use Object.assign() instead.
(Use `node --trace-deprecation ...` to show where the warning was created)
(node:14980) [DEP0060] DeprecationWarning: The `util._extend` API is deprecated. Please use Object.assign() instead.
(Use `node --trace-deprecation ...` to show where the warning was created)
Requests: 1048 (21%), requests per second: 210, mean latency: 138.9 ms
Requests: 1013 (20%), requests per second: 203, mean latency: 144.2 ms
Requests: 976 (20%), requests per second: 195, mean latency: 149.2 ms
Requests: 914 (18%), requests per second: 183, mean latency: 159.1 ms
Requests: 2059 (41%), requests per second: 209, mean latency: 142.6 ms
Requests: 2125 (43%), requests per second: 215, mean latency: 139.7 ms
Requests: 2044 (41%), requests per second: 214, mean latency: 140.4 ms
Errors: 2, accumulated errors: 2, 0.1% of total requests
Requests: 1982 (40%), requests per second: 214, mean latency: 140.1 ms
Requests: 3106 (62%), requests per second: 209, mean latency: 142.7 ms
Errors: 2, accumulated errors: 2, 0.1% of total requests
Requests: 3227 (65%), requests per second: 220, mean latency: 135.8 ms
Requests: 3122 (62%), requests per second: 216, mean latency: 138.2 ms
Errors: 3, accumulated errors: 5, 0.2% of total requests
Requests: 3055 (61%), requests per second: 215, mean latency: 139.2 ms
Errors: 2, accumulated errors: 2, 0.1% of total requests
Requests: 4203 (84%), requests per second: 196, mean latency: 152.6 ms
Requests: 4061 (81%), requests per second: 191, mean latency: 157.1 ms
Errors: 2, accumulated errors: 4, 0.1% of total requests
Requests: 4092 (82%), requests per second: 194, mean latency: 154.3 ms
Errors: 1, accumulated errors: 6, 0.1% of total requests
Requests: 4027 (81%), requests per second: 195, mean latency: 153.8 ms
Errors: 0, accumulated errors: 2, 0% of total requests

Target URL:          http://localhost:4444/api/v1/owner
Max requests:        20000
Concurrent clients:  120
Running on cores:    4
Agent:               keepalive

Completed requests:  20000
Total errors:        14
Total time:          24.806 s
Mean latency:        146.5 ms
Effective rps:       806

Percentage of requests served within a certain time
  50%      132 ms
  90%      240 ms
  95%      282 ms
  99%      403 ms
 100%      671 ms (longest request)

   -1:   14 errors
# PS E:\ORG\Paikar-Software\EPS\backend> npx loadtest -n 10000 -c 50 -k http://localhost:4444/api/v1/owner
(node:15420) [DEP0060] DeprecationWarning: The `util._extend` API is deprecated. Please use Object.assign() instead.
(Use `node --trace-deprecation ...` to show where the warning was created)
(node:19540) [DEP0060] DeprecationWarning: The `util._extend` API is deprecated. Please use Object.assign() instead.
(Use `node --trace-deprecation ...` to show where the warning was created)
(node:2884) [DEP0060] DeprecationWarning: The `util._extend` API is deprecated. Please use Object.assign() instead.
(Use `node --trace-deprecation ...` to show where the warning was created)
(node:19048) [DEP0060] DeprecationWarning: The `util._extend` API is deprecated. Please use Object.assign() instead.
(Use `node --trace-deprecation ...` to show where the warning was created)
(node:7368) [DEP0060] DeprecationWarning: The `util._extend` API is deprecated. Please use Object.assign() instead.      
(Use `node --trace-deprecation ...` to show where the warning was created)
Requests: 1362 (54%), requests per second: 272, mean latency: 178.4 ms
Errors: 22, accumulated errors: 22, 1.6% of total requests
Requests: 1032 (41%), requests per second: 206, mean latency: 232.2 ms
Errors: 28, accumulated errors: 28, 2.7% of total requests
Requests: 976 (39%), requests per second: 195, mean latency: 245.5 ms
Requests: 979 (39%), requests per second: 196, mean latency: 245.4 ms
Errors: 28, accumulated errors: 28, 2.9% of total requests
Errors: 22, accumulated errors: 22, 2.3% of total requests
Requests: 2244 (90%), requests per second: 243, mean latency: 204.7 ms
Errors: 32, accumulated errors: 60, 2.7% of total requests
Requests: 2201 (88%), requests per second: 245, mean latency: 201.8 ms
Errors: 28, accumulated errors: 50, 2.3% of total requests
Requests: 2113 (85%), requests per second: 227, mean latency: 217.4 ms
Errors: 34, accumulated errors: 62, 2.9% of total requests

Target URL:          http://localhost:4444/api/v1/owner
Max requests:        10000
Concurrent clients:  200
Running on cores:    4
Agent:               keepalive

Completed requests:  10000
Total errors:        242
Total time:          11.115 s
Mean latency:        207.4 ms
Effective rps:       900

Percentage of requests served within a certain time
  50%      183 ms
  90%      355 ms
  95%      449 ms
  99%      740 ms
 100%      1177 ms (longest request)

   -1:   242 errors
# PS E:\ORG\Paikar-Software\EPS\backend> npx loadtest -n 20000 -c 100 -k http://localhost:4444/api/v1/owner
(node:22052) [DEP0060] DeprecationWarning: The `util._extend` API is deprecated. Please use Object.assign() instead.
(Use `node --trace-deprecation ...` to show where the warning was created)
(node:1320) [DEP0060] DeprecationWarning: The `util._extend` API is deprecated. Please use Object.assign() instead.
(Use `node --trace-deprecation ...` to show where the warning was created)
(node:1364) [DEP0060] DeprecationWarning: The `util._extend` API is deprecated. Please use Object.assign() instead.
(Use `node --trace-deprecation ...` to show where the warning was created)
(node:3928) [DEP0060] DeprecationWarning: The `util._extend` API is deprecated. Please use Object.assign() instead.      
(Use `node --trace-deprecation ...` to show where the warning was created)
(node:23180) [DEP0060] DeprecationWarning: The `util._extend` API is deprecated. Please use Object.assign() instead.
(Use `node --trace-deprecation ...` to show where the warning was created)
Requests: 1519 (30%), requests per second: 304, mean latency: 236.9 ms
Errors: 787, accumulated errors: 787, 51.8% of total requests
Requests: 1051 (21%), requests per second: 210, mean latency: 244.2 ms
Errors: 514, accumulated errors: 514, 48.9% of total requests
Requests: 1146 (23%), requests per second: 229, mean latency: 336 ms
Errors: 575, accumulated errors: 575, 50.2% of total requests
Requests: 831 (17%), requests per second: 166, mean latency: 492.5 ms
Errors: 417, accumulated errors: 417, 50.2% of total requests
Requests: 2381 (48%), requests per second: 173, mean latency: 622.2 ms
Errors: 283, accumulated errors: 1070, 44.9% of total requests
Requests: 2065 (41%), requests per second: 184, mean latency: 549.9 ms
Requests: 2086 (42%), requests per second: 207, mean latency: 644.2 ms
Errors: 238, accumulated errors: 752, 36% of total requests
Errors: 319, accumulated errors: 894, 43.3% of total requests
Requests: 1814 (36%), requests per second: 197, mean latency: 447.5 ms
Errors: 422, accumulated errors: 839, 46.3% of total requests
Requests: 3198 (64%), requests per second: 163, mean latency: 689.9 ms
Errors: 69, accumulated errors: 1139, 35.6% of total requests
Requests: 2997 (60%), requests per second: 182, mean latency: 586.1 ms
Requests: 2859 (57%), requests per second: 159, mean latency: 698.5 ms
Errors: 58, accumulated errors: 810, 27% of total requests
Errors: 64, accumulated errors: 958, 33.5% of total requests
Requests: 2598 (52%), requests per second: 157, mean latency: 765.3 ms
Errors: 70, accumulated errors: 909, 35% of total requests
Requests: 4092 (82%), requests per second: 179, mean latency: 567.7 ms
Errors: 104, accumulated errors: 1243, 30.4% of total requests
Requests: 3756 (75%), requests per second: 180, mean latency: 573.7 ms
Requests: 3885 (78%), requests per second: 178, mean latency: 566.1 ms
Errors: 84, accumulated errors: 894, 23% of total requests
Requests: 3501 (70%), requests per second: 181, mean latency: 569.8 ms
Errors: 97, accumulated errors: 1055, 28.1% of total requests
Errors: 84, accumulated errors: 993, 28.4% of total requests
Requests: 4846 (97%), requests per second: 151, mean latency: 649.3 ms
Errors: 80, accumulated errors: 1323, 27.3% of total requests
Requests: 4657 (93%), requests per second: 154, mean latency: 641.9 ms
Errors: 75, accumulated errors: 969, 20.8% of total requests
Requests: 4261 (85%), requests per second: 152, mean latency: 639.1 ms
Requests: 4530 (91%), requests per second: 155, mean latency: 642.2 ms
Errors: 69, accumulated errors: 1062, 24.9% of total requests
Errors: 84, accumulated errors: 1139, 25.1% of total requests

Target URL:          http://localhost:4444/api/v1/owner
Max requests:        20000
Concurrent clients:  400
Running on cores:    4
Agent:               keepalive

Completed requests:  20000
Total errors:        4662
Total time:          28.965 s
Mean latency:        554.9 ms
Effective rps:       690

Percentage of requests served within a certain time
  50%      455 ms
  90%      911 ms
  95%      1183 ms
  99%      4790 ms
 100%      6372 ms (longest request)

   -1:   4662 errors