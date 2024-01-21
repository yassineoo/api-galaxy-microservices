package services

import (
	"context"
	"errors"
	"fmt"
	"local_packages/api/types"
	"local_packages/models"

	"gorm.io/gorm"
)

// ----------------------------- endpoints crud -----------------------------
// ----------------------------- endpoints crud -----------------------------
// ----------------------------- endpoints crud -----------------------------
// ----------------------------- endpoints crud -----------------------------
// ----------------------------- endpoints crud -----------------------------
// ----------------------------- endpoints crud -----------------------------
// ----------------------------- endpoints crud -----------------------------
// ----------------------------- endpoints crud -----------------------------
// ----------------------------- endpoints crud -----------------------------
// ----------------------------- endpoints crud -----------------------------


func (s *Service) CreateEndpointsGroup(ctx context.Context, endpointsGroup types.EndpointsGroupDto) (*models.EndpointsGroupEntity, error) {
    newEndpointsGroup := models.EndpointsGroupEntity{ 
		Group:  endpointsGroup.Group,
		APiID: endpointsGroup.ApiID,
		//Endpoints: endpointsGroup.Endpoints,
	}


	if err := s.gormDB.Create(&newEndpointsGroup).Error; err != nil {
        return nil, err
    }
    return &newEndpointsGroup, nil
}

func (s *Service) GetAllGroups(ctx context.Context, page int, limit int) ([]models.EndpointsGroupEntity, error) {
    var categories []models.EndpointsGroupEntity

  

    offset := (page - 1) * limit

    if err := s.gormDB.Offset(offset).Limit(limit).Find(&categories).Error; err != nil {
        return nil, err
    }

    return categories, nil
}


func (s *Service) UpdateEndpointsGroup(ctx context.Context, id int, endpointsGroup types.EndpointsGroupDto) (*models.EndpointsGroupEntity, error) {
    var existingEndpointsGroup models.EndpointsGroupEntity
    if err := s.gormDB.First(&existingEndpointsGroup, id).Error; err != nil {
        if errors.Is(err, gorm.ErrRecordNotFound) {
            return nil, errors.New("endpointsGroup not found")
        }
        return nil, err
    }

    // Update fields
	if (endpointsGroup.Group  != "") {
    existingEndpointsGroup.Group = endpointsGroup.Group 
	}

    if err := s.gormDB.Save(&existingEndpointsGroup).Error; err != nil {
        return nil, err
    }

    return &existingEndpointsGroup, nil
}


func (s *Service) DeleteEndpointsGroup(ctx context.Context, id int) error {



	   // Check if the item exists before attempting to delete it
	   var endpointsGroup models.ApiEntity
	   if err := s.gormDB.First(&models.EndpointsGroupEntity{}, id).Error; err != nil {
		   if errors.Is(err, gorm.ErrRecordNotFound) {
			   return fmt.Errorf("endpointsGroup with id %d not found", id)
		   }
		   return err
	   }
   
	   // Delete the item from the database
	   if err := s.gormDB.Delete(&endpointsGroup).Error; err != nil {
		   return err
	   }
	   return nil
}



// ----------------------------- API Endpoints CRUD -----------------------------
// ----------------------------- API Endpoints CRUD -----------------------------
// ----------------------------- API Endpoints CRUD -----------------------------
// ----------------------------- API Endpoints CRUD -----------------------------
// ----------------------------- API Endpoints CRUD -----------------------------
// ----------------------------- API Endpoints CRUD -----------------------------
// ----------------------------- API Endpoints CRUD -----------------------------
// ----------------------------- API Endpoints CRUD -----------------------------
// ----------------------------- API Endpoints CRUD -----------------------------
// ----------------------------- API Endpoints CRUD -----------------------------
// ----------------------------- API Endpoints CRUD -----------------------------
// ----------------------------- API Endpoints CRUD -----------------------------
// ----------------------------- API Endpoints CRUD -----------------------------
// ----------------------------- API Endpoints CRUD -----------------------------

func (s *Service) CreateApiEndpoints(ctx context.Context, endpoints types.EndpointsDto) (*models.EndpointsEntity, error) {
   
    
    newEndpoints := models.EndpointsEntity{
        GroupID: endpoints.GroupID,
        Methode: endpoints.Methode,
        Group: endpoints.Group,
        Url: endpoints.Url,
        Description: endpoints.Description,

        // Populate with fields from endpoints
        // Example: EndpointsName: endpoints.EndpointsName
    }

    if err := s.gormDB.Create(&newEndpoints).Error; err != nil {
        return nil, err
    }
    return &newEndpoints, nil
}

func (s *Service) GetApiEndpointss(ctx context.Context, apiID int) ([]models.EndpointsEntity, error) {
    var endpointss []models.EndpointsEntity

    if err := s.gormDB.Where("api_id = ?", apiID).Find(&endpointss).Error; err != nil {
        return nil, err
    }

    return endpointss, nil
}

func (s *Service) UpdateApiEndpoints(ctx context.Context, endpointsID int, endpointsDto types.EndpointsDto) (*models.EndpointsEntity, error) {
    var existingEndpoints models.EndpointsEntity
    if err := s.gormDB.First(&existingEndpoints, endpointsID).Error; err != nil {
        if errors.Is(err, gorm.ErrRecordNotFound) {
            return nil, errors.New("api endpoints not found")
        }
        return nil, err
    }

    // Update fields from endpointsDto
	if endpointsDto.Url != "" {
    existingEndpoints.Url = endpointsDto.Url
}
    if endpointsDto.Methode != "" {
    existingEndpoints.Methode = endpointsDto.Methode
}
    if endpointsDto.Group != "" {
    existingEndpoints.Group = endpointsDto.Group
}

    if endpointsDto.Description != "" {
    existingEndpoints.Description = endpointsDto.Description
}


    // Add other fields as needed

    if err := s.gormDB.Save(&existingEndpoints).Error; err != nil {
        return nil, err
    }

    return &existingEndpoints, nil
}

func (s *Service) DeleteApiEndpoints(ctx context.Context, endpointsID int) error {
    // Check if the item exists before attempting to delete it
    var endpoints models.EndpointsEntity
    if err := s.gormDB.First(&endpoints, endpointsID).Error; err != nil {
        if errors.Is(err, gorm.ErrRecordNotFound) {
            return fmt.Errorf("api endpoints with id %d not found", endpointsID)
        }
        return err
    }

    // Delete the item from the database
    if err := s.gormDB.Delete(&endpoints).Error; err != nil {
        return err
    }
    return nil
}