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
		ApiID: endpointsGroup.ApiID,
		Description : endpointsGroup.Description,
		//Endpoints: endpointsGroup.Endpoints,
	}


	if err := s.gormDB.Create(&newEndpointsGroup).Error; err != nil {
        return nil, err
    }
    return &newEndpointsGroup, nil
}

func (s *Service) GetApiGroups(ctx context.Context, apiID int) ([]models.EndpointsGroupEntity, error) {
    var categories []models.EndpointsGroupEntity

  

    if err := s.gormDB.Where("api_id = ?", apiID).Find(&categories).Error; err != nil {
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
	if (endpointsGroup.Description  != "") {
		existingEndpointsGroup.Description = endpointsGroup.Description
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
			Methode: endpoints.Methode,
			Group: endpoints.Group,
			Url: endpoints.Url,
			Description: endpoints.Description,
		}

	  // If GroupID is not provided, fetch the default GroupID based on ApiID
	  if endpoints.GroupID == 0 {
        defaultGroup, err := s.getDefaultGroupByApiID(ctx, endpoints.ApiID)
        if err != nil {
            return nil, err
        }
		newEndpoints.GroupID = defaultGroup.ID
        //endpoints.GroupID = defaultGroup.ID
    }


    if err := s.gormDB.Create(&newEndpoints).Error; err != nil {
        return nil, err
    }
    return &newEndpoints, nil
}


// getDefaultGroupByApiID fetches the default group by ApiID
func (s *Service) getDefaultGroupByApiID(ctx context.Context, apiID int) (*models.EndpointsGroupEntity, error) {
    var defaultGroup models.EndpointsGroupEntity

    // Adjust the logic based on how you define the default group (e.g., where conditions)
    if err := s.gormDB.Where("api_id = ? AND is_default = true", apiID).First(&defaultGroup).Error; err != nil {
        return nil, err
    }

    return &defaultGroup, nil
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























