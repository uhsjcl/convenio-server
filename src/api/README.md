# API Documentation

- [API Documentation](#API-Documentation)
  - [Usage](#Usage)
    - [Common Error Responses](#Common-Error-Responses)
  - [User API](#User-API)
    - [Create user](#Create-user)
    - [Get user](#Get-user)
    - [Update user](#Update-user)
  - [Post (Announcements) API](#Post-Announcements-API)
    - [Get post](#Get-post)
    - [Create post](#Create-post)
    - [Publish post](#Publish-post)
    - [Update (edit) post](#Update-edit-post)
  - [Event (Scheduling) API](#Event-Scheduling-API)
    - [Get event](#Get-event)
    - [Create event](#Create-event)
    - [Update (edit) event](#Update-edit-event)

## Usage

[Insomnia](https://insomnia.rest) is a minimalistic REST client that allows for testing of server endpoints.

[Download the official Insomnia environment]()

Documentation code snippets are written in:

- JavaScript (using `async fetch()`)
- Java (using native `HTTPUrlConnection`)
- Java (using `OkHttp` client)
- Swift (using `Alamofire`)

### Common Error Responses

- **Code:** `400 INTERNAL SERVER ERROR`
- **Content:** varies

    > An internal server error has occurred from the HTTP request. This may be due to invalid input data (causing the server to misapply the input) or due to a system failure. Please view your staging server's logs for more details.

- **Code:** `401 FORBIDDEN`
- **Content:** `"... No Access-Control-Allow-Origin header is present... Origin <url> is therefore not allowed access."`

    > This is a CORS (Cross-Origin Response System) error. Please ensure that your staging server is properly configured for development requests, and ensure that all request headers are accounted for. Contact backend administrators for further assistance.

- **Code:** `404 NOT FOUND` and `408 REQUEST TIMEOUT`
- **Content:** none

    > Please check that your fetch URL is valid and that your network settings are correct. Also, ensure that your staging server is operational or that your local server is operating on the correct port.

## User API

### Create user

> Create one new user account

- **URL**

  `/api/user/create`

- **Method**

  `POST`

- **URL Parameters**

  **Required:**

    `password: String`

    `firstName: String`

    `lastName: String`

  **Optional:**

    `email: String` - must be valid email string, required if you intend the account to be used by convention organizers

- **Data Parameters**
- **Expected Response**
  - Code: `200 OK`
  - Content: `{ id: 1823789 }` - returns ID of newly created user account
- **Error Response**
  - Code: `422 UNPROCESSABLE ENTITY`
  - Content: `{ error: 'email | password' }` - error string detailing invalid parameter (oneof: `email | password`)
- **Sample Call**
  <details>
    <summary>JavaScript</summary>

    ```typescript
    const post = async () => {
      ...
      const response = await fetch('https://<url>/api/user/create', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: 'admin@uhsjcl.com',
          password: 'admin',
          firstName: 'Bob',
          lastName: 'Joe'
        })
      });
      ...
    };
    ```

  </details>
  <details>
    <summary>Java (with <code>HTTPUrlConnection</code>)</summary>

    ```java
    ```

  </details>
  <details>
    <summary>Java (with OkHttp)</summary>

    ```java
    MediaType JSON
    = MediaType.get("application/json; charset=utf-8");

    OkHttpClient client = new OkHttpClient();

    String json = "'email': 'admin@uhsjcl.com',"
      + "'password': 'admin',"
      + "'firstName': 'Bob'",
      + "'lastName': 'Joe'";

    RequestBody body = RequestBody.create(JSON, json);
    Request request = new Request.Builder()
        .url('https://<url>/api/user/create')
        .post(body)
        .build();
    try (Response response = client.newCall(request).execute()) {
      System.out.println(response.body().string());
    }
    ```

  </details>
  <details>
    <summary>Swift</summary>

    ```swift
    import Alamofire

    ...

    let url = URL(string: "https://<url>/api/user/create")!
    let param: Parameters = [
      "email": "admin@uhsjcl.com",
      "password": "admin",
      "firstName": "Bob",
      "lastName": "Joe"
    ]
    Alamofire.request(
      url,
      method: .post,
      parameters: param,
      encoding: JSONEncoding.default
    ).responseJSON { response in
      if let json = response.result.value {
        print("Response in JSON: \(json)")
      }
    }

    ...
    ```

  </details>

- **Notes**

  - All user data must be sent over `HTTPS` for security.
  - User accounts are intended only for convention admins/organizers. All other accounts should be pre-created 

### Get user

> Fetch first matching user account information from server

- **URL**

  `/api/user/:id`

  `/api/user/get` - (POST, requires body)

- **Method**

  `GET`

  `POST`

- **URL Parameters**

  `:id` - the ID of the user account to query (required)

- **Data Parameters**

  **Required (only one):**

    `id`

    `email`

- **Error and Expected Response**
- **Sample Call**

### Update user

> Update user account information given email or ID

- **URL**
- **Method**
- **URL Parameters**
- **Data Parameters**
- **Error and Expected Response**
- **Sample Call**

## Post (Announcements) API

### Get post

### Create post

### Publish post

### Update (edit) post

## Event (Scheduling) API

### Get event

### Create event

### Update (edit) event
