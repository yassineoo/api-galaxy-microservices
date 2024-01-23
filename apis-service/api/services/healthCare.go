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
		ApiID:          healthCheck.ApiID,
		URL:            healthCheck.URL,
		Schedule:       healthCheck.Schedule,
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
	if (HealthCheckDto.URL != "") {
		healthCheck.URL = HealthCheckDto.URL
	}
	if (HealthCheckDto.Schedule != "") {
		healthCheck.Schedule = HealthCheckDto.Schedule
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
