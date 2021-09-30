# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly). Each URL is tied to a specific user, and only that user has the ability to modify the URL. We use conventional cookie encryption to track user sessions, and password hashing to secure the accounts. The app now tracks the amount of visitors that have clicked through your shortened link!

## Final Product


!["Screenshot of URLs page"](https://raw.githubusercontent.com/ACristoff/myTinyApp/master/docs/tinyapp1.png)

!["Screenshot of a specific URL page"](https://raw.githubusercontent.com/ACristoff/myTinyApp/master/docs/tinyapp2.png)

## Dependencies

- Node.js
- Express
- EJS
- bcrypt
- body-parser
- cookie-session
- Morgan (optional)

## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js` command.