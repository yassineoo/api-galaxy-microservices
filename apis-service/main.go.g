package main

import (
	"context"
	"log"
	"net/http"

	"local_packages/apiService"

	"github.com/jackc/pgx/v4/pgxpool"
	httpSwagger "github.com/swaggo/http-swagger"
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
