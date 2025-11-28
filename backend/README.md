Backend API - Documents

==========================================================================================

Main Path: http://localhost:4444/api/v1

==========================================================================================



# 🚀 Basic Test
Send 10,000 requests with 100 concurrent users:
npx loadtest -n 10000 -c 100 http://localhost:4444/api/test
npx loadtest -n 10000 -c 100 -k http://localhost:4444/api/test

# 💥 Stress Test (push server hard)
loadtest -n 50000 -c 1000 http://localhost:4444/api/test

# 🔑 Test POST request
loadtest \
  -n 5000 \
  -c 200 \
  -T "application/json" \
  -P '{"email":"test@mail.com","password":"123456"}' \
  http://localhost:4444/api/login

# 🧠 Run continuously (so you can watch pressure)
loadtest -c 200 --rps 2000 http://localhost:4444/api/test



## Authentication - Routes END POINT /auth

GET    : /dashboard - show user id with role if user logged in and JWT token not expired

GET    : /me - show logged in user information from token 

POST   : /login - credential for login check email, password
==========================================================================================











































