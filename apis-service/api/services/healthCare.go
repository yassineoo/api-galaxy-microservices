package services

import (
	"context"
	"errors"
	"fmt"
	"local_packages/api/types"
	"local_packages/models"
	"time"

	"gorm.io/gorm"
)

// HealthCheck CRUD operations
func (s *Service) CreateHealthCheck(ctx context.Context, healthCheck types.HealthCheckDto) (*models.HealthCheckEntity, error) {
	newHealthCheck := models.HealthCheckEntity{ 
		//ApiID:          healthCheck.ApiID,
		//URL:            healthCheck.URL,
		//Schedule:       healthCheck.Schedule,
		LastStatus:     "pending",
		LastCheckedAt:  time.Now(),
		//NextCheckAt:    healthCheck.NextCheckAt,
		AlertsEnabled:  healthCheck.AlertsEnabled,
	}



	
	if err := s.gormDB.Create(&newHealthCheck).Error; err != nil {
		return nil, err
	}
	return &newHealthCheck, nil
}

func (s *Service) GetHealthCheck(ctx context.Context, apiID int) (*models.HealthCheckEntity, error) {
	var healthCheck models.HealthCheckEntity
	if err := s.gormDB.Where("api_id = ?", apiID).First(&healthCheck).Error; err != nil {
		return nil, err
	}
	return &healthCheck, nil
}

func (s *Service) UpdateHealthCheck(ctx context.Context, id int, HealthCheckDto types.HealthCheckDto) (*models.HealthCheckEntity, error) {
	var healthCheck models.HealthCheckEntity
	if err := s.gormDB.First(&healthCheck, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("healthCheck with id %d not found", id)
		}
		return nil, err
	}


	if (!HealthCheckDto.AlertsEnabled ) {
		healthCheck.AlertsEnabled = HealthCheckDto.AlertsEnabled
	}



	if err := s.gormDB.Model(&healthCheck).Updates(healthCheck).Error; err != nil {
		return nil, err
	}

	return &healthCheck, nil
}

func (s *Service) DeleteHealthCheck(ctx context.Context, id int) error {
	if err := s.gormDB.Delete(&models.HealthCheckEntity{}, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return fmt.Errorf("healthCheck with id %d not found", id)
		}
		return err
	}
	return nil
}

func (s *Service) CreateHealthCheckResult(ctx context.Context, healthCheckResultDto types.HealthCheckResultDto) (*models.HealthCheckResultEntity, error) {
	// Start a transaction because we're doing multiple operations that must be atomic.
	tx := s.gormDB.Begin()

	// Check if the transaction started successfully.
	if tx.Error != nil {
		return nil, tx.Error
	}

	// Create the new HealthCheckResultEntity.
	healthCheckResult := models.HealthCheckResultEntity{
		HealthCheckID: healthCheckResultDto.HealthCheckID,
		Status:        healthCheckResultDto.Status,
		ResponseTime:  healthCheckResultDto.ResponseTime,
		StatusMessage: healthCheckResultDto.StatusMessage,
		CheckedAt:     time.Now(),
	}

	// Save the new HealthCheckResultEntity.
	if err := tx.Create(&healthCheckResult).Error; err != nil {
		tx.Rollback() // Rollback the transaction on error.
		return nil, err
	}

	// Update the HealthCheckEntity's status and last checked time.
	if err := tx.Model(&models.HealthCheckEntity{}).Where("id = ?", healthCheckResultDto.HealthCheckID).Updates(models.HealthCheckEntity{
		LastStatus:    healthCheckResultDto.Status,
		LastCheckedAt: healthCheckResult.CheckedAt,
	}).Error; err != nil {
		tx.Rollback() // Rollback the transaction on error.
		return nil, err
	}

	// Commit the transaction if all is well.
	if err := tx.Commit().Error; err != nil {
		return nil, err
	}

	// Return the new HealthCheckResultEntity.
	return &healthCheckResult, nil
}

func (s *Service) GetHealthCheckResults(ctx context.Context, healthCheckID int) ([]models.HealthCheckResultEntity, error) {
	var results []models.HealthCheckResultEntity
	if err := s.gormDB.Where("health_check_id = ?", healthCheckID).Find(&results).Error; err != nil {
		return nil, err
	}
	return results, nil
}





func (s *Service) GetHealthCheckSuccessPercentage(ctx context.Context, apiID int) (float64, error) {
	var totalChecks int64
	var successChecks int64

	// Get the total number of health checks for the given API ID.
	if err := s.gormDB.Model(&models.HealthCheckResultEntity{}).
		Joins("join health_checks on health_checks.id = health_check_results.health_check_id").
		Where("health_checks.api_id = ?", apiID).
		Count(&totalChecks).Error; err != nil {
		return 0, err
	}

	// Get the count of successful health checks.
	if err := s.gormDB.Model(&models.HealthCheckResultEntity{}).
		Joins("join health_checks on health_checks.id = health_check_results.health_check_id").
		Where("health_checks.api_id = ? AND health_check_results.status = ?", apiID, "success").
		Count(&successChecks).Error; err != nil {
		return 0, err
	}

	// Avoid division by zero
	if totalChecks == 0 {
		return 0, nil
	}

	// Calculate the percentage of successful checks.
	successPercentage := (float64(successChecks) / float64(totalChecks)) * 100

	return successPercentage, nil
}





















func (s *Service) GetApiHealthCheck(ctx context.Context, apiID int, page int, limit int) (types.ApiHealthCheckResponse, error) {
    // Set a default limit if it's not specified or if it's <= 0.
    if limit <= 0 {
        limit = 10 // You can choose a suitable default value.
    }

    // Set a default page if it's not specified or if it's <= 0.
    if page <= 0 {
        page = 1 // Default to the first page.
    }

    // Calculate the offset based on the page and limit.
    offset := (page - 1) * limit


	var HealthCheckEntity models.HealthCheckEntity;
	if err := s.gormDB.Where("api_id = ?", apiID).First(&HealthCheckEntity).Error; err != nil {
		return types.ApiHealthCheckResponse{}, err
	}
	
    var totalItems int64
    if err := s.gormDB.Model(&models.HealthCheckResultEntity{}).
        Where("health_check_id = ?", HealthCheckEntity.ID).
        Count(&totalItems).Error; err != nil {
        return types.ApiHealthCheckResponse{}, err
    }

    var apiLogs []models.HealthCheckResultEntity
    if err := s.gormDB.
        Preload("HealthCheck"). // Preload the related HealthCheck
        Where("health_check_id = ?",  HealthCheckEntity.ID).
        Offset(offset).Limit(limit).
       // Order("checked_at DESC"). // Order by the latest checked_at first
        Find(&apiLogs).Error; err != nil {
        return types.ApiHealthCheckResponse{}, err
    }

    totalPages := (int(totalItems) + limit - 1) / limit // Calculate total pages.

    response := types.ApiHealthCheckResponse{
        HealthCheck: apiLogs,
        Meta: types.PaginationMeta{
            TotalItems:   int(totalItems),
            ItemCount:    len(apiLogs),
            ItemsPerPage: limit,
            TotalPages:   totalPages,
            CurrentPage:  page,
        },
    }

    return response, nil
}



// stat function 


type ApiHealthStat struct {
    ApiID            int
    AverageResponseTime int
    Availability     float64
}




func (s *Service) GetApiHealthStats(ctx context.Context, apiIDs []int) ([]ApiHealthStat, error) {
    var stats []ApiHealthStat

    for _, apiID := range apiIDs {
        var healthCheckEntity models.HealthCheckEntity
        err := s.gormDB.Where("api_id = ?", apiID).First(&healthCheckEntity).Error
        if err != nil {
            if errors.Is(err, gorm.ErrRecordNotFound) {
                // Handle the case where no HealthCheckEntity exists for the given apiID
                stats = append(stats, ApiHealthStat{
                    ApiID:              apiID,
                    AverageResponseTime: 0,
                    Availability:       0,
                })
                continue
            }
            // Return any other errors encountered
            return nil, err
        }

        var results []models.HealthCheckResultEntity
        if err := s.gormDB.Where("health_check_id = ?", healthCheckEntity.ID).Find(&results).Error; err != nil {
            return nil, err
        }

        var totalResponseTime int
        var successCount int
        for _, result := range results {
            totalResponseTime += result.ResponseTime
            if result.Status == "success" {
                successCount++
            }
        }

        averageResponseTime := 0
        if len(results) > 0 {
            averageResponseTime = totalResponseTime / len(results)
        }

        availability := 0.0
        if len(results) > 0 {
            availability = float64(successCount) / float64(len(results))
        }

        stats = append(stats, ApiHealthStat{
            ApiID:              apiID,
            AverageResponseTime: averageResponseTime,
            Availability:       availability,
        })
    }

    return stats, nil
}
