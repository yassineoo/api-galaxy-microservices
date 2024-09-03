package database

import (
	// replace with your actual models' package path

	"local_packages/models"
	"log"

	"gorm.io/gorm"
)

func MigrateDatabase(db *gorm.DB) error {
    log.Println("Migrating database...")





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
        &models.BodyParamEntity{}, // Remove the duplicate entry
        &models.HealthCheckEntity{},
        &models.HealthCheckResultEntity{},
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
        &models.ReviewReportsEntity{},
        &models.ApiReportEntity{},
        &models.LikeEntity{},
        &models.SettingsEntity{},
    )

    if err != nil {
        log.Printf("Migration failed: %v", err)
        return err
    }

    log.Println("Migrating database done")
    return nil
}
