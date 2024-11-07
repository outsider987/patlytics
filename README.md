# Docker Compose Setup

To run the application using Docker Compose:

1. Make sure you have Docker and Docker Compose installed on your system

2. Set up environment files:
   - Copy `.example.env` to `.env` in both frontend and backend directories:
     ```bash
     # For frontend
     cp frontend/.example.env frontend/.env

     # For backend
     cp backend/.example.env backend/.env
     ```
   - Update the environment variables in `backend/.env` with your OpenAI API key


3. From the root directory, run:
```
docker compose up
```


4. Once the application is running, you could follow this link to test: [Patlytics Test](https://patlytics-tawny.vercel.app/)

