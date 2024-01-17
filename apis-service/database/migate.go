package database

import (
	// replace with your actual models' package path
	"local_packages/models"

	"gorm.io/gorm"
)

func MigrateDatabase(db *gorm.DB) error {
    // Define your GORM migration code here
    err := db.AutoMigrate(
        &models.CategoryEntity{}, 
        &models.ApiEntity{}, 
        &models.UsageLogEntity{}, 
        &models.ApiKeyEntity{}, 
        &models.ApiRatingEntity{},
        &models.ApiVersionEntity{},  
        &models.PlanEntity{}, 
        &models.SubscriptionEntity{},
    )

    return err
}
