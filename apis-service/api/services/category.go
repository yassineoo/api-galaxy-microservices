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

// ----------------------------- category crud -----------------------------
// ----------------------------- category crud -----------------------------
// ----------------------------- category crud -----------------------------
// ----------------------------- category crud -----------------------------
// ----------------------------- category crud -----------------------------
// ----------------------------- category crud -----------------------------
// ----------------------------- category crud -----------------------------
// ----------------------------- category crud -----------------------------
// ----------------------------- category crud -----------------------------
// ----------------------------- category crud -----------------------------


func (s *Service) CreateCategory(ctx context.Context, category types.CategoryDto) (*models.CategoryEntity, error) {
    newCategory := models.CategoryEntity{ 
		CategoryName: category.CategoryName ,
		Description: category.Description,
	}

	if err := s.gormDB.Create(&newCategory).Error; err != nil {
        return nil, err
    }
    return &newCategory, nil
}

func (s *Service) GetAllCategories(ctx context.Context, page int, limit int) ([]models.CategoryEntity, error) {
    var categories []models.CategoryEntity

  

    offset := (page - 1) * limit

    if err := s.gormDB.Offset(offset).Limit(limit).Find(&categories).Error; err != nil {
        return nil, err
    }

    return categories, nil
}


func (s *Service) UpdateCategory(ctx context.Context, id int, category types.CategoryDto) (*models.CategoryEntity, error) {
    var existingCategory models.CategoryEntity
    if err := s.gormDB.First(&existingCategory, id).Error; err != nil {
        if errors.Is(err, gorm.ErrRecordNotFound) {
            return nil, errors.New("category not found")
        }
        return nil, err
    }

    // Update fields
	if (category.CategoryName  != "") {
    existingCategory.CategoryName = category.CategoryName 
	}
	if (category.Description != "") {

    existingCategory.Description = category.Description
    }// Add other fields as needed

    if err := s.gormDB.Save(&existingCategory).Error; err != nil {
        return nil, err
    }

    return &existingCategory, nil
}


func (s *Service) DeleteCategory(ctx context.Context, id int) error {



	   // Check if the item exists before attempting to delete it
	   var category models.ApiEntity
	   if err := s.gormDB.First(&models.CategoryEntity{}, id).Error; err != nil {
		   if errors.Is(err, gorm.ErrRecordNotFound) {
			   return fmt.Errorf("category with id %d not found", id)
		   }
		   return err
	   }
   
	   // Delete the item from the database
	   if err := s.gormDB.Delete(&category).Error; err != nil {
		   return err
	   }
	   return nil
}


// ----------------------------- API Subscription CRUD -----------------------------

func (s *Service) CreateApiSubscription(ctx context.Context, subscription types.SubscriptionDto) (*models.SubscriptionEntity, error) {
    newSubscription := models.SubscriptionEntity{
        UserID: subscription.UserID,
        PlanID: subscription.PlanId,
        StartDate : time.Now() ,
      
        // Populate with fields from subscription
        // Example: SubscriptionName: subscription.SubscriptionName
    }

    if err := s.gormDB.Create(&newSubscription).Error; err != nil {
        return nil, err
    }
    return &newSubscription, nil
}

func (s *Service) GetApiSubscriptions(ctx context.Context, apiID int) ([]models.SubscriptionEntity, error) {
    var subscriptions []models.SubscriptionEntity

    if err := s.gormDB.Where("id = ?", apiID).Find(&subscriptions).Error; err != nil {
        return nil, err
    }

    return subscriptions, nil
}

func (s *Service) UpdateApiSubscription(ctx context.Context, subscriptionID int, subscriptionDto types.SubscriptionDto) (*models.SubscriptionEntity, error) {
    var existingSubscription models.SubscriptionEntity
    if err := s.gormDB.First(&existingSubscription, subscriptionID).Error; err != nil {
        if errors.Is(err, gorm.ErrRecordNotFound) {
            return nil, errors.New("api subscription not found")
        }
        return nil, err
    }

    // Update fields from subscriptionDto
    // Example: existingSubscription.SubscriptionName = subscriptionDto.SubscriptionName if subscriptionDto.SubscriptionName != ""
    // Add other fields as needed

    if err := s.gormDB.Save(&existingSubscription).Error; err != nil {
        return nil, err
    }

    return &existingSubscription, nil
}

func (s *Service) DeleteApiSubscription(ctx context.Context, subscriptionID int) error {
    // Check if the item exists before attempting to delete it
    var subscription models.SubscriptionEntity
    if err := s.gormDB.First(&subscription, subscriptionID).Error; err != nil {
        if errors.Is(err, gorm.ErrRecordNotFound) {
            return fmt.Errorf("api subscription with id %d not found", subscriptionID)
        }
        return err
    }

    // Delete the item from the database
    if err := s.gormDB.Delete(&subscription).Error; err != nil {
        return err
    }
    return nil
}












// ===================== API Logs  =====================
// ===================== API Logs  =====================
// ===================== API Logs  =====================
// ===================== API Logs  =====================
// ===================== API Logs  =====================
// GetApiLogs retrieves API logs with pagination based on the provided parameters.
func (s *Service) GetApiLogs(ctx context.Context, apiID int, page int, limit int) (types.ApiLogsResponse, error) {
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

	var totalItems int64
	if err := s.gormDB.Model(&models.UsageLogEntity{}).
		Joins("JOIN endpoints_entities ON endpoints_entities.id = usage_log_entities.endpoint_id").
		Joins("JOIN endpoints_group_entities ON endpoints_group_entities.id = endpoints_entities.group_id").
		Where("endpoints_group_entities.api_id = ?", apiID).
		Count(&totalItems).Error; err != nil {
		return types.ApiLogsResponse{}, err
	}

	var apiLogs []models.UsageLogEntity
	if err := s.gormDB.
		Preload("Endpoint").
		Joins("JOIN endpoints_entities ON endpoints_entities.id = usage_log_entities.endpoint_id").
		Joins("JOIN endpoints_group_entities ON endpoints_group_entities.id = endpoints_entities.group_id").
		Where("endpoints_group_entities.api_id = ?", apiID).
		Offset(offset).Limit(limit).
		Find(&apiLogs).Error; err != nil {
		return types.ApiLogsResponse{}, err
	}

	totalPages := (int(totalItems) + limit - 1) / limit // Calculate total pages.

	response := types.ApiLogsResponse{
		Logs: apiLogs,
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
