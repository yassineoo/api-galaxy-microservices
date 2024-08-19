package database

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/jackc/pgx/v4/pgxpool"
	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var (
	gormDB *gorm.DB
)

// InitDB initializes the database connections using pgxpool and GORM
func InitDB() (*pgxpool.Pool, *gorm.DB) {
	// Load .env file
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}

	// Retrieve the DATABASE_URL from environment
	dbURL := os.Getenv("DATABASE_URL")

	// Connect to the database using pgxpool
	dbpool, err := pgxpool.Connect(context.Background(), dbURL)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Unable to connect to database: %v\n", err)
		os.Exit(1)
	}

	// Connect to the database using GORM
	gormDB, err = gorm.Open(postgres.Open(dbURL), &gorm.Config{})
	if err != nil {
		fmt.Fprintf(os.Stderr, "Failed to create GORM database: %v\n", err)
		os.Exit(1)
	}

	// Perform database migration
	err = MigrateDatabase(gormDB)

	
	if err != nil {
		fmt.Fprintf(os.Stderr, "Database migration failed: %v\n", err)
		os.Exit(1)
	}
	log.Println("Database migration completed")

	return dbpool, gormDB
}

// GetDB returns the GORM database instance
func GetDB() *gorm.DB {
	return gormDB
}
