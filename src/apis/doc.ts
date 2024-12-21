import { Request, Response } from "express";
async function docs(request: Request, response: Response) {
    response.send(`
   
    <html>
      <head>
        <style>
          body {
            
            background-color:#f9f9f9;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
          }

          .container {
            background-color: white;
            border-radius: 8px;
            padding: 20px;
           
           
            max-width: 600px;
            width: 100%;
          }

          h1 {
            color: #333;
            font-size: 2em;
            margin-bottom: 15px;
          }

          p {
            color: #555;
            font-size: 1.1em;
            margin-bottom: 20px;
          }

          a {
            display: inline-block;
            padding: 10px 20px;
            font-size: 18px;
            color: #fff;
            background-color: #007bff;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
            transition: background-color 0.3s ease;
          }

          a:hover {
            background-color: #0056b3;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Welcome to Mapped API Documentation</h1>
          <p>
            Mapped is a URL-shortening service built using modern web technologies. 
            With this service, you can shorten long URLs into concise, manageable links. 
            The service also tracks detailed analytics like the total clicks, unique clicks, IPs, and geographic locations of users.
          </p>
          <p>
            The backend is powered by <strong>Node.js</strong>, with <strong>Kafka</strong> for event logging and <strong>Redis</strong> for caching. 
            Rate limiting is implemented using Redis to ensure smooth traffic handling. 
            The project is containerized using Docker and deployed to an EC2 instance for high availability.
          </p>
          <p>
            Click the button below to explore the available endpoints and get more information about how to interact with the API.
          </p>
          <a href="https://github.com/ayarvind/mapped" target="_blank">
            Know about available endpoints
          </a>
        </div>
      </body>
    </html>

   
        
    `).status(200).contentType("text/html");
}

export default docs