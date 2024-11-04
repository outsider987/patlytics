# Start with an official Python runtime as a parent image
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install any needed packages specified in requirements.txt
# Make sure to have a requirements.txt in the root of your project
RUN pip install --no-cache-dir -r requirements.txt

# Make port 80 available to the world outside this container
EXPOSE 80

# Define environment variable (optional)
ENV NAME World

# Run the application
# Replace 'main.py' with the actual file you want to run
CMD ["python", "main.py"]
