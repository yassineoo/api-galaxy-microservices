FROM golang:1.21.6-alpine

WORKDIR /app

# Copy only the go.mod and go.sum files and download dependencies
COPY go.mod go.sum ./
RUN go mod download

# Copy the entire application source code
COPY . .

# Build the application
RUN go build -o main

# Expose the port on which your application will listen
EXPOSE 8000

# Command to run the executable
CMD ["./main"]

#sudo docker build -t api_service_image .
#sudo docker run -p 8088:8088 api_service_image

