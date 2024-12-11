# Contact API Spec

## Create Contact

Endpoint: POST /api/contacts

Headers:

- Authorization: token

Request Body:

```json
{
  "first_name": "Your",
  "last_name": "Name",
  "email": "sample@email.com",
  "phone": "6288888888"
}
```

Response Body:

```json
{
  "data": {
    "id": 1,
    "first_name": "Your",
    "last_name": "Name",
    "email": "sample@email.com",
    "phone": "6288888888"
  }
}
```

## Get Contact

Endpoint: GET /api/contacts/:contactId

Headers:

- Authorization: token

Response Body:

```json
{
  "data": {
    "id": 1,
    "first_name": "Your",
    "last_name": "Name",
    "email": "sample@email.com",
    "phone": "6288888888"
  }
}
```

## Update Contact

Endpoint: PUT /api/contacts/:contactId

Headers:

- Authorization: token

Request Body:

```json
{
  "first_name": "Your",
  "last_name": "Name",
  "email": "sample@email.com",
  "phone": "6288888888"
}
```

Response Body:

```json
{
  "data": {
    "id": 1,
    "first_name": "Your",
    "last_name": "Name",
    "email": "sample@email.com",
    "phone": "6288888888"
  }
}
```

## Remove Contact

Endpoint: DELETE /api/contacts/:contactId

Headers:

- Authorization: token

Response Body:

```json
{
  "data": true
}
```

## Search Contact

Endpoint: GET /api/contacts

Headers:

- Authorization: token

Query Params:

- name: string, contact first name or contact last name, optional
- phone: string, contact phone, optional
- email: string, contact email, optional
- page: number, default 1
- size: number, default 10

Response Body:

```json
{
  "data": [
    {
      "id": 1,
      "first_name": "Your",
      "last_name": "Name",
      "email": "sample@email.com",
      "phone": "6288888888"
    },
    {
      "id": 1,
      "first_name": "Your",
      "last_name": "Name",
      "email": "sample@email.com",
      "phone": "6288888888"
    }
  ],
  "meta": {
    "current_page": 1,
    "total_page": 10,
    "size": 10
  }
}
```
