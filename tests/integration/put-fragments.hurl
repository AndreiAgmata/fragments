# tests/integration/put-fragments.hurl

# Authenticated POST to /v1/fragments
POST http://localhost:8080/v1/fragments
# We're sending a plain text fragment
Content-Type: text/plain
# Include HTTP Basic Auth credentials
[BasicAuth]
user1@email.com:password1
# Body of the request goes in ```...``` when it's a string
`This is a fragment!`

# 1. We expect to get back an HTTP 201
HTTP/1.1 201
[Asserts]
header "Location" matches "^http:\/\/localhost:8080\/v1\/fragments\/[A-Za-z0-9_-]+$"
jsonpath "$.status" == "ok"

# Capture the Location URL into a variable named `url`
[Captures]
url: header "Location"
id: jsonpath "$.fragment.id"

# 2. Try to GET the fragment
GET {{url}}
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
Content-Length: 19
[Asserts]
header "Content-Type" startsWith "text/plain"
body == "This is a fragment!"

# 3. Try to update the data of the fragment
PUT {{url}}
Content-Type: text/plain
[BasicAuth]
user1@email.com:password1

`This is an updated fragment!`

HTTP/1.1 201
[Asserts]
jsonpath "$.fragment.id" matches "^[A-Za-z0-9_-]+$"
jsonpath "$.fragment.ownerId" matches "^[0-9a-fA-F]+$"
jsonpath "$.fragment.created" isString
jsonpath "$.fragment.updated" isString
jsonpath "$.fragment.type" == "text/plain"
jsonpath "$.fragment.size" == 28

GET {{url}}
[BasicAuth]
user1@email.com:password1
HTTP/1.1 200
[Asserts]
header "Content-Type" startsWith "text/plain"
body == "This is an updated fragment!"
