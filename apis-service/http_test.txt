package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"local_packages/apiService"

	"github.com/jackc/pgx/v4/pgxpool"
	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

// Mock dependencies as necessary for your tests
func mockDbConnection() (*pgxpool.Pool, *gorm.DB) {
    // Mock your database connection here
    // Return both pgxpool and gorm DB objects
    // These could be actual test databases or mocked objects
    return Bdd2()
}

// TestApiEndpoints tests the API endpoints
func TestApiEndpoints(t *testing.T) {
    // Mock the database connection
    mockedDbPool, mockedGormDB := mockDbConnection()
    defer mockedDbPool.Close() // Remember to close resources after use

    // Create an instance of your service with mocked dependencies
    apiServiceInstance := apiService.NewService(mockedDbPool, mockedGormDB)

    // Initialize your endpoints
    endpoints := apiService.MakeEndpoints(apiServiceInstance)
// Create a test server using httptest
testServer := httptest.NewServer(apiService.NewHTTPServer(context.Background(), endpoints))
defer testServer.Close()

// Test cases for each endpoint
tests := []struct {
    description string
    route       string
    method      string
    statusCode  int
}{
    {
        description: "Test GET /get-one endpoint",
        route:       "/get-all",
        method:      "GET",
        statusCode:  http.StatusOK,
    },
    // Add more test cases for other endpoints
}

// Iterate through test cases
for _, tc := range tests {
    t.Run(tc.description, func(t *testing.T) {
        // Create request
        req, err := http.NewRequest(tc.method, testServer.URL+tc.route, nil)
        if err != nil {
            t.Fatal(err)
        }

        // Perform the request
        resp, err := http.DefaultClient.Do(req)
        if err != nil {
            t.Fatal(err)
        }
        defer resp.Body.Close()

        // Check the status code
        if resp.StatusCode != tc.statusCode {
            t.Errorf("Expected status code %d, got %d", tc.statusCode, resp.StatusCode)
        }

        // Here you can add more checks as needed, like checking the response body
    })
}
}



func Bdd2() (*pgxpool.Pool, *gorm.DB) {
    // Load environment variables from a .env file
    if err := godotenv.Load(); err != nil {
       log.Println("No .env file found")
   }

   // Load configuration from environment variables or a config file
   dbURL := os.Getenv("DATABASE_URL")

   // Establish a connection to the database using pgx
   dbpool, err := pgxpool.Connect(context.Background(), dbURL)
   if err != nil {
       fmt.Fprintf(os.Stderr, "Unable to connect to database: %v\n", err)
       os.Exit(1)
   }
   defer dbpool.Close()
   log.Println("Connected to database")

   // Establish a connection to the database using GORM
   gormDB, err := gorm.Open(postgres.Open(dbURL), &gorm.Config{})
   if err != nil {
       fmt.Fprintf(os.Stderr, "Failed to create GORM database: %v\n", err)
       os.Exit(1)
   }

 

   return dbpool,gormDB;
}