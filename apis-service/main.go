package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"

	"local_packages/apiService"
	"local_packages/models"

	"github.com/jackc/pgx/v4/pgxpool"
	"github.com/joho/godotenv"
	httpSwagger "github.com/swaggo/http-swagger"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func main() {
    var dbpool *pgxpool.Pool 
	var gormDB *gorm.DB ;
	dbpool, gormDB =  Bdd()

    ctx := context.Background()

    // Assuming you have an instance of ApiService implementation
    apiServiceInstance := apiService.NewService(dbpool ,gormDB) // Update this line based on your actual implementation

    // MakeEndpoints initializes all Go Kit endpoints for the ApiService.
    endpoints := apiService.MakeEndpoints(apiServiceInstance)
    // Initialize Swagger UI for development
    setupSwagger()

    httpHandler := apiService.NewHTTPServer(ctx, endpoints)
    log.Fatal(http.ListenAndServe(":8080", httpHandler))
}

// setupSwagger initializes Swagger UI
func setupSwagger() {
    http.Handle("/swagger/", http.StripPrefix("/swagger/", httpSwagger.Handler(
        httpSwagger.URL("http://localhost:8080/swagger/doc.json"), // The URL to access the Swagger JSON documentation.
    )))
}

func migrateDatabase(db *gorm.DB) error {
    // Define your GORM migration code here
    err := db.AutoMigrate(&models.CategoryEntity{},&models.ApiEntity{},&models.UsageLogEntity{}, &models.ApiKeyEntity{}, &models.ApiRatingEntity{},
        &models.ApiVersionEntity{},  &models.PlanEntity{}, &models.SubscriptionEntity{})

    if err != nil {
        return err
    }
    return nil
}

func Bdd() (*pgxpool.Pool, *gorm.DB) {
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

    // Perform database migration
    err = migrateDatabase(gormDB)
    if err != nil {
        fmt.Fprintf(os.Stderr, "Database migration failed: %v\n", err)
        os.Exit(1)
    }
    log.Println("Database migration completed")

	return dbpool,gormDB;
}