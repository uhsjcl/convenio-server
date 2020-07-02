# API Documentation

- [API Documentation](#api-documentation)
  - [Usage](#usage)
    - [Common Error Responses](#common-error-responses)
    - [API Structure](#api-structure)
    - [Authentication and Using No-Pass Mode](#authentication-and-using-no-pass-mode)
  - [User API](#user-api)
    - [Create user](#create-user)
    - [Get user](#get-user)
    - [Update user](#update-user)
  - [Post (Announcements) API](#post-announcements-api)
    - [Get post](#get-post)
    - [Create post](#create-post)
    - [Publish post](#publish-post)
    - [Update (edit) post](#update-edit-post)
  - [Event (Scheduling) API](#event-scheduling-api)
    - [Get event](#get-event)
    - [Create event](#create-event)
    - [Update (edit) event](#update-edit-event)
  - [Tournaments and Competitive Brackets API](#tournaments-and-competitive-brackets-api)

## Usage

[Insomnia](https://insomnia.rest) is a minimalistic REST client that allows for testing of server endpoints. [Download the official Insomnia environment]() here for immediate testing.

The documentation includes code snippet examples to go with each endpoint. Examples are written in:

- JavaScript (using `async fetch()`)
- Java (using native `HTTPUrlConnection`)
- Java (using `OkHttp` client)
- Swift (using `Alamofire`)

### Common Error Responses

Requests to Convenio have several common outcomes. A successful REST request will always return a `2xx` code. Below are some common errors and how to diagnose them.

- **Code:** `400 INTERNAL SERVER ERROR`
- **Content:** varies

    > An internal server error has occurred from the HTTP request. This may be due to invalid input data (causing the server to misapply the input) or due to a system failure. Please view your staging server's logs for more details.

- **Code:** `401 FORBIDDEN`
- **Content:** `"... No Access-Control-Allow-Origin header is present... Origin <url> is therefore not allowed access."`

    > This is a CORS (Cross-Origin Response System) error. Please ensure that your staging server is properly configured for development requests, and ensure that all request headers are accounted for. Contact backend administrators for further assistance.

- **Code:** `404 NOT FOUND` and `408 REQUEST TIMEOUT`
- **Content:** none

    > Please check that your fetch URL is valid and that your network settings are correct. Also, ensure that your staging server is operational or that your local server is operating on the correct port.

### API Structure

The Convenio API makes available two endpoints for GET requests: one to the controller followed by `/get` (POST) and one with `/:id` as a URL parameter. Queries to `/get` are POST requests and require a JSON body, and queries to `/:id` are GET requests and do not require any body parameters.

### Authentication and Using No-Pass Mode



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

  `/api/user/update`

- **Method**

  `POST`

- **Data Parameters**

  `email` - the account's email

  `oldPassword` - old password

  `newPassword` - new password

  `firstName`

  `lastName`

- **Error and Expected Response**
- **Sample Call**

## Post (Announcements) API

### Get post

> Query data associated with one specific post or many posts. Supports pagination.

- **URL**

  `/api/post/get`

  `/api/post/:id`

- **Method**

  `POST`

  `GET`

- **URL Parameters**

  `:id` - the ID associated with the post (retrieve only one)

- **Data Parameters**

  `uuid` - unique identifier (will retrieve only one)

  **Optional Parameters** (to retrieve multiple):

  `dateStart` - date greater than

  `dateEnd` - date less than

  `count` - number of posts to retrieve

### Create post

> Create a markdown or rich-HTML flavored text post. Support for images not yet implemented.

- **URL**

  `/api/post/create`

- **Method**

  `POST`

- **Data Parameters**

  `title` - title of the post/announcement

  `author` - uuid of the author

  `body` - markdown or rich-HTML body

  `publish` - (true/false) whether or not to immediately publish the post upon creation.

### Publish post

### Update (edit) post

## Event (Scheduling) API

### Get event

> Query event data. Supports pagination.

- **URL**

  `/api/event/get`

  `/api/event/:id`

- **Method**

  `POST`

  `GET`

- **URL Parameters**

  `:id` - the ID associated with the event (retrieve only one)

- **Data Parameters** (use when POSTing to `/get`)

  `uuid` - unique identifier (will retrieve only one)

  **Optional Parameters** (to retrieve multiple):

  `location` - building code/room code of event

  `dateStart` - date greater than

  `dateEnd` - date less than

  `count` - number of events to retrieve

### Create event

> Create a markdown or rich-HTML flavored text post. Support for images not yet implemented.

- **URL**

  `/api/event/create`

- **Method**

  `POST`

- **Data Parameters**

  `title` - title of the event

  `location` - room id

  `open` - open enrollment

  `capacity` - max number of participants (hard cap)

  `publish` - (true/false) whether or not to immediately publish the post upon creation.

### Update (edit) event

## Tournaments and Competitive Brackets API
