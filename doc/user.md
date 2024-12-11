# User API Spec

## Register User

Endpoint : POST /api/users

Request Body :

```json
{
  "username": "username",
  "password": "rahasia",
  "name": "Your Name"
}
```

Response Body (Success) :

```json
{
  "data": {
    "username": "username",
    "name": "Your Name"
  }
}
```

Response Body (Fail) :

```json
{
  "errors": "Username already registered"
}
```

## Login User

Endpoint : POST /api/users/login

Request Body :

```json
{
  "username": "username",
  "password": "rahasia"
}
```

Response Body (Success) :

```json
{
  "data": {
    "username": "username",
    "name": "Your Name",
    "token": "session_id_generated"
  }
}
```

Response Body (Fail) :

```json
{
  "errors": "Username or password is wrong"
}
```

## Get User

Endpoint : GET /api/users/current

Headers :

- authorization: token

Response Body (Success) :

```json
{
  "data": {
    "username": "username",
    "name": "Your Name"
  }
}
```

Response Body (Fail) :

```json
{
  "errors": "Unauthorized"
}
```

## Update User

Endpoint : PATCH /api/users/current

Headers :

- authorization: token

Request Body :

```json
{
  "password": "rahasia", // optional, if want to change password
  "name": "Your Name" // optional, if want to change name
}
```

Response Body (Success) :

```json
{
  "data": {
    "username": "username",
    "name": "Your Name"
  }
}
```

## Logout User

Endpoint : DELETE /api/users/current

Headers :

- authorization: token

Response Body (Success) :

```json
{
  "data": true
}
```
