# OpenContribute

[![Live Demo](https://img.shields.io/badge/Demo-Live-green?style=for-the-badge&logo=vercel)](https://opencontribute.onrender.com/)
[![API Docs](https://img.shields.io/badge/API-Postman-orange?style=for-the-badge&logo=postman)](https://documenter.getpostman.com/view/26561912/2sB2iwFaAR)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](#)

---

**Build dreams. Share resources. Make a difference.**

**OpenContribute** is a project that connects:

- People who have a vision that serves a common cause but lack the resources to succeed.
- People who want to support common cause projects — personally, materially, financially, or otherwise — and have resources they are willing to share, lend, give, or dedicate.

This platform brings them together.

---

## 🌐 Live Demo

🔗 [https://opencontribute.onrender.com/](https://opencontribute.onrender.com/)

> *Note: The demo focuses on core functionality. Some API features are not fully implemented in the UI.*

---

## 📚 Full API Documentation

🔗 [https://documenter.getpostman.com/view/26561912/2sB2iwFaAR](https://documenter.getpostman.com/view/26561912/2sB2iwFaAR)

---

## 🛠️ Tech Stack

- Node.js
- Express
- MongoDB (Mongoose)
- Pug (Server-side rendering)
- Postman (for API documentation)

---

## 📜 License

This project is licensed under the MIT License.

---

## ⚙️ Environment Variables

| Variable                  | Description                                     |
| -------------------------- | ----------------------------------------------- |
| `NODE_ENV`                 | Environment mode (`development` or `production`) |
| `PORT`                     | Port number the server runs on                 |
| `HOST`                     | Hostname for the server                        |
| `DATABASE`                 | MongoDB connection URI (with placeholder for password) |
| `DATABASE_PASSWORD`        | Password for the MongoDB connection            |
| `JWT_SECRET`               | Secret key for signing JWT tokens              |
| `JWT_EXPIRES_IN`           | JWT token expiration time (e.g., `30d`)         |
| `JWT_COOKIE_EXPIRES_IN`     | JWT cookie expiration time (in days)            |
| `MAILTRAP_USER`            | Mailtrap username for email testing            |
| `MAILTRAP_PASS`            | Mailtrap password for email testing            |
| `FEED_MAX_IMAGE_ALLOWED`   | Maximum number of images allowed per feed      |
| `FEED_MAX_VIDEO_ALLOWED`   | Maximum number of videos allowed per feed      |
| `STRIPE_SECRET_KEY`        | Stripe API secret key for handling payments    |
| `STRIPE_WEBHOOK_SECRET`    | Stripe webhook secret for verifying events     |
| `GEOAPIFY_API_KEY`         | API key for Geoapify (geocoding/maps service)   |

---

## 🏗️ How to Run Locally

1. **Clone the repository**

    ```bash
    git clone https://github.com/your-username/opencontribute.git
    cd opencontribute
    ```

2. **Install dependencies**

    ```bash
    npm install
    ```

3. **Build the project**

    Before running tests, make sure to build the project:

    ```bash
    npm run build
    ```

4. **Set up environment variables**

    Create a `.env` file in the root directory and add your environment variables. Example:

    ```dotenv
    PORT=3000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    ```

5. **Run the tests**

    ```bash
    npm run test
    ```

---

**Made with ❤️ as part of my backend development journey.**
