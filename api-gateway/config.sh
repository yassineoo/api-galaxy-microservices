#!/bin/bash

# Kong Admin API base URL
KONG_ADMIN_URL="http://localhost:8001"

# Function to add a service to Kong with error handling
add_service() {
  SERVICE_NAME="$1"
  SERVICE_HOST="$2"
  SERVICE_PORT="$3"

  # Validate port is an integer
  if [[ ! "$SERVICE_PORT" =~ ^[0-9]+$ ]]; then
    echo "Error: Invalid port provided. Please provide an integer for port."
    return 1
  fi

  # Construct service URL
  SERVICE_URL="http://${SERVICE_HOST}:${SERVICE_PORT}"

  # Send request to add service
  curl -i -X POST  "${KONG_ADMIN_URL}/services/" \
    --data "name=${SERVICE_NAME}" \
    --data "url=${SERVICE_URL}" || {
      echo "Error adding service: $SERVICE_NAME"
      return 1
    }

  echo "Service '$SERVICE_NAME' added successfully."
}

# Function to add a route to Kong with error handling and HTTP method selection
add_route() {
  SERVICE_NAME="$1"
  ROUTE_PATH="$2"
  HTTP_METHOD="$3"  # New argument for HTTP method

  # Validate path is not empty
  if [[ -z "$ROUTE_PATH" ]]; then
    echo "Error: Empty path provided. Please specify a valid path for the route."
    return 1
  fi

  # Send request to add route
  curl -i -X POST \
    --url "${KONG_ADMIN_URL}/services/${SERVICE_NAME}/routes" \
    --data "paths[]=${ROUTE_PATH}" \
    --data "methods[]=${HTTP_METHOD}"  \
  || {
    echo "Error adding route to service: $SERVICE_NAME"
    return 1
  }

  echo "Route '$ROUTE_PATH' (method: $HTTP_METHOD) added to service '$SERVICE_NAME' successfully."
}


# Example usage
add_service "api-service" "localhost" 8088
add_route "api-service" "/apis" "GET"
