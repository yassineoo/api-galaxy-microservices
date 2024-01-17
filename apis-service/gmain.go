package main

import (
	"local_packages/database"
	"local_packages/service"

	"github.com/jackc/pgx/v4/pgxpool"
	gorm "gorm.io/gorm"

	"github.com/gin-gonic/gin"
)

func main() {
	var gorm *gorm.DB;
	var dbpool *pgxpool.Pool;
    dbpool, gorm = database.InitDB()
    svc := service.NewService(dbpool, gorm)

    router := gin.Default()
    service.SetupRoutes(router, svc)
    router.Run()
}