package database

import (
	// replace with your actual models' package path

	"local_packages/models"
	"log"

	"gorm.io/gorm"
)

func MigrateDatabase(db *gorm.DB) error {
	// Define your GORM migration code here
	log.Println("Migrating database...");
	log.Println("Migrating database...");
	log.Println("Migrating database...");
	log.Println("Migrating database...");
	log.Println("Migrating database...");
	err := db.AutoMigrate(
		&models.CategoryEntity{},
		&models.ApiEntity{},
		&models.UsageLogEntity{},
		&models.ApiKeyEntity{},
		&models.ApiRatingEntity{},
		&models.ApiVersionEntity{},
		&models.PlanEntity{},
		&models.SubscriptionEntity{},
		&models.EndpointsGroupEntity{},
		&models.EndpointsEntity{},
		&models.EndpointsParameterEntity{},
		&models.BodyParamEntity{},
		&models.HealthCheckEntity{},
		&models.HealthCheckResultEntity{},
		
	
	)
	log.Println("Migrating database...");
	log.Println("Migrating database...");
	log.Println("Migrating database...");


	return err
}
