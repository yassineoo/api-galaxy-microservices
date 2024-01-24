package services

import (
	"context"
	"errors"
	"fmt"
	"local_packages/api/types"
	"local_packages/models"

	"gorm.io/gorm"
)

// ----------------------------- endpoints group crud -----------------------------
// ----------------------------- endpoints group crud -----------------------------
// ----------------------------- endpoints group crud -----------------------------
// ----------------------------- endpoints group crud -----------------------------
// ----------------------------- endpoints group crud -----------------------------
// ----------------------------- endpoints group crud -----------------------------
// ----------------------------- endpoints group crud -----------------------------
// ----------------------------- endpoints group crud -----------------------------
// ----------------------------- endpoints group crud -----------------------------
// ----------------------------- endpoints group crud -----------------------------


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


// private function  :  getDefaultGroupByApiID fetches the default group by ApiID
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








// ----------------------------- endpoints paramter  crud -----------------------------
// ----------------------------- endpoints paramter  crud -----------------------------
// ----------------------------- endpoints paramter  crud -----------------------------
// ----------------------------- endpoints paramter  crud -----------------------------
// ----------------------------- endpoints paramter  crud -----------------------------
// ----------------------------- endpoints paramter  crud --------²---------------------
// ----------------------------- endpoints paramter  crud -----------------------------
// ----------------------------- endpoints paramter  crud -----------------------------
// ----------------------------- endpoints paramter  crud -----------------------------
// ----------------------------- endpoints paramter  crud -----------------------------


func (s *Service) CreateEndpointsParameter(ctx context.Context, endpointsParameter types.EndpointsParameterDto) (*models.EndpointsParameterEntity, error) {
    newEndpointsParameter := models.EndpointsParameterEntity{ 
		
		Key:  endpointsParameter.Key,
		ValueType: endpointsParameter.ValueType,
		ExampleValue : endpointsParameter.ExampleValue,
		Required: endpointsParameter.Required,
		EndpointID: endpointsParameter.EndpointID,
		ParameterType: endpointsParameter.ParameterType,
	}


	if err := s.gormDB.Create(&newEndpointsParameter).Error; err != nil {
        return nil, err
    }
    return &newEndpointsParameter, nil
}

func (s *Service) GetEndpointParameter(ctx context.Context, endpointsID int) ([]models.EndpointsParameterEntity, error) {
    var categories []models.EndpointsParameterEntity

  

    if err := s.gormDB.Where("endpoint_id = ?", endpointsID).Find(&categories).Error; err != nil {
        return nil, err
    }

    return categories, nil


}


func (s *Service) UpdateEndpointsParameter(ctx context.Context, id int, endpointsParameter types.EndpointsParameterDto) (*models.EndpointsParameterEntity, error) {
    var existingEndpointsParameter models.EndpointsParameterEntity
    if err := s.gormDB.First(&existingEndpointsParameter, id).Error; err != nil {
        if errors.Is(err, gorm.ErrRecordNotFound) {
            return nil, errors.New("endpointsParameter not found")
        }
        return nil, err
    }

    // Update fields
	if (endpointsParameter.Key  != "") {
	existingEndpointsParameter.Key = endpointsParameter.Key
	}

	if (endpointsParameter.ValueType  != "") {
	existingEndpointsParameter.ValueType = endpointsParameter.ValueType
	}
	if (endpointsParameter.ExampleValue  != "") {
		existingEndpointsParameter.ExampleValue = endpointsParameter.ExampleValue
		}
	
	existingEndpointsParameter.Required = endpointsParameter.Required


    return &existingEndpointsParameter, nil
}


func (s *Service) DeleteEndpointsParameter(ctx context.Context, id int) error {



	   // Check if the item exists before attempting to delete it
	   var endpointsParameter models.ApiEntity
	   if err := s.gormDB.First(&models.EndpointsParameterEntity{}, id).Error; err != nil {
		   if errors.Is(err, gorm.ErrRecordNotFound) {
			   return fmt.Errorf("endpointsParameter with id %d not found", id)
		   }
		   return err
	   }
   
	   // Delete the item from the database
	   if err := s.gormDB.Delete(&endpointsParameter).Error; err != nil {
		   return err
	   }
	   return nil
}



func (s *Service) CreateBodyParamAndParameters(ctx context.Context, bodyParamDto types.BodyParamDto) (*models.BodyParamEntity, error) {
    // Create a new BodyParamEntity
    newBodyParam := models.BodyParamEntity{
        EndpointID:  bodyParamDto.EndpointID,
        ContentType: bodyParamDto.ContentType,
        TextBody:    bodyParamDto.TextBody,
    }

    if err := s.gormDB.Create(&newBodyParam).Error; err != nil {
        return nil, err
    }

    // Create Parameters for each element in the array
    var params []models.EndpointsParameterEntity
    for _, paramDto := range bodyParamDto.Parameters {
        param := models.EndpointsParameterEntity{
            EndpointID:    bodyParamDto.EndpointID,
            Key:           paramDto.Key,
            ValueType:     paramDto.ValueType,
            ParameterType: paramDto.ParameterType,
            ExampleValue:  paramDto.ExampleValue,
            Required:      paramDto.Required,
        }
        params = append(params, param)
    }

    if err := s.gormDB.Create(&params).Error; err != nil {
        return nil, err
    }

    return &newBodyParam, nil
}





















