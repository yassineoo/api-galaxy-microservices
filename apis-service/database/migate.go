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
		&models.ApiCollectionEntity{},
		&models.ApiEntity{},
		&models.ApiDocsEntity{},
		&models.SubscriptionEntity{},

		&models.UsageLogEntity{},
		&models.ApiKeyEntity{},
		&models.ApiReviewEntity{},
		&models.ApiVersionEntity{},
		&models.PlanEntity{},
		&models.EndpointsGroupEntity{},
		&models.EndpointsEntity{},
		&models.EndpointsParameterEntity{},
		&models.BodyParamEntity{},
		&models.HealthCheckEntity{},
		&models.HealthCheckResultEntity{},
		&models.BodyParamEntity{},
		&models.ObjectPlanEntity{},
		&models.CrossObjectEntity{},
		&models.EndpointObjectEntity{},
		&models.UserEntity{},
		&models.ProfileEntity{},
		&models.PermissionEntity{},
		&models.ModeratorPermissionEntity{},
		&models.InvoiceEntity{},
		&models.PaymentMethodEntity{},
		&models.BillingHistoryEntity{},
		&models.TransactionEntity{},





		//&models.
	)
	log.Println("Migrating database done  1");
	log.Println("Migrating database...");
	log.Println("Migrating database...");


	return err
}
