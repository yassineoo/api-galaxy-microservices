package main

import (
	//  "src/apiService"
	"context"
	"fmt"
	"net/http"
	"os"

	//"os/signal"
	//"syscall"
	"apiService/apiService"
	"log"

	"github.com/jackc/pgx/v4/pgxpool"
	"github.com/joho/godotenv"
	"github.com/swaggo/http-swagger"
	"gorm.io/gorm"
)

func main() {
	// Load environment variables from a .env file
	// This step is optional if you're setting environment variables in another way
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}

        
    // Load configuration from environment variables or a config file
    dbURL := os.Getenv("DATABASE_URL")

	// Establish a connection to the database
	dbpool, err := pgxpool.Connect(context.Background(), dbURL)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Unable to connect to database: %v\n", err)
		os.Exit(1)
	}
	defer dbpool.Close()
	log.Println("Connected to database")

	// Perform database migration
	err = migrateDatabase(dbpool)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Database migration failed: %v\n", err)
		os.Exit(1)
	}
	log.Println("Database migration completed")

	ctx := context.Background()

	// Assuming you have an instance of ApiService implementation
	apiServiceInstance := apiService.NewService(dbpool)

	// MakeEndpoints initializes all Go Kit endpoints for the ApiService.
	endpoints := apiService.MakeEndpoints(apiServiceInstance)
	// Initialize Swagger UI for development
	setupSwagger()

	httpHandler := apiService.NewHTTPServer(ctx, endpoints)
	log.Fatal(http.ListenAndServe(":8080", httpHandler))
	// Rest of your application logic
}

// setupSwagger initializes Swagger UI
func setupSwagger() {
	http.Handle("/swagger/", http.StripPrefix("/swagger/", httpSwagger.Handler(
		httpSwagger.URL("http://localhost:8080/swagger/doc.json"), // The URL to access the Swagger JSON documentation.
	)))
}

func migrateDatabase(db *gorm.DB) error {
	// Define your GORM migration code here
	// For example:
	err :=  db.AutoMigrate(&apiService.ApiEntity{},&apiService.ApiKey{});

	if err != nil {
		return err
	}
	return nil
}
