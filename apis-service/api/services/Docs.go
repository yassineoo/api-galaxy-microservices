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

func (s *Service) GetApiDocs(ctx context.Context, apiID int) (*models.ApiDocsEntity, error) {
	// Implement the logic to retrieve an item by ID from the database.
	// You can use s.db and s.gormDB to interact with the database.
	// Replace the placeholder logic with your actual database query.
	var api models.ApiDocsEntity
	if err := s.gormDB.Where("api_id = ?", apiID).First(&api).Error; err != nil {
		return nil, err
	}
	return &api, nil
}

func (s *Service) CreateApiDocs(ctx context.Context, apiDocs types.ApiDocsDto) (*models.ApiDocsEntity, error) {
	// Implement the logic to create a new item in the database.
	// You can use s.db and s.gormDB to interact with the database.
	// Replace the placeholder logic with your actual database insertion.
	newApiDocs := models.ApiDocsEntity{
		ApiID: apiDocs.ApiID,
		Content: apiDocs.Content,
		// Set other fields as needed
	}
	if err := s.gormDB.Create(&newApiDocs).Error; err != nil {
		return nil, err
	}
	return &newApiDocs, nil
}

func (s *Service) UpdateApiDocs(ctx context.Context, id int, apiDocs types.ApiDocsDto) (*models.ApiDocsEntity, error) {
	var api models.ApiDocsEntity
	if err := s.gormDB.First(&api,id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
            return nil, errors.New("category not found")
        }
        return nil, err
	}

		api.Content = apiDocs.Content

	
	api.LastUpdated = time.Now()
	if err := s.gormDB.Save(&api).Error; err != nil {
		return nil, err
	}
	return &api, nil
}




func (s *Service) DeleteApiDocs(ctx context.Context, id int) error {
	// Check if the item exists before attempting to delete it
	var apiDocs models.ApiDocsEntity
	if err := s.gormDB.First(&models.ApiDocsEntity{}, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return fmt.Errorf("item with id %d not found", id)
		}
		return err
	}
	   // Delete the item from the database
	if err := s.gormDB.Delete(&apiDocs).Error; err != nil {
		return err
	}
	return nil
}



