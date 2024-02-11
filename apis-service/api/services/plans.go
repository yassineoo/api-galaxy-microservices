package services

import (
	"context"
	"errors"
	"fmt"
	"local_packages/api/types"
	"local_packages/models"
	"log"

	"gorm.io/gorm"
)

// ----------------------------- API Plan CRUD -----------------------------
// ----------------------------- API Plan CRUD -----------------------------
// ----------------------------- API Plan CRUD -----------------------------
// ----------------------------- API Plan CRUD -----------------------------
// ----------------------------- API Plan CRUD -----------------------------
// ----------------------------- API Plan CRUD -----------------------------
// ----------------------------- API Plan CRUD -----------------------------
// ----------------------------- API Plan CRUD -----------------------------
// ----------------------------- API Plan CRUD -----------------------------
// ----------------------------- API Plan CRUD -----------------------------
// ----------------------------- API Plan CRUD -----------------------------

// CreateApiPlan creates new API plans and objects in the database based on the provided DTO
func (s *Service) CreateApiPlan(ctx context.Context, planDto types.PlansDto) ([]models.PlanEntity, error) {
    var newPlans []models.PlanEntity
    var newObjectPlans []models.ObjectPlanEntity
    var newCrossObjects []models.CrossObjectEntity
    

    for _, publicPlanDto := range planDto.PublicPlans {
        // Convert PublicPlanDto to PlanEntity
        newPlan := models.PlanEntity{
            ApiID:         planDto.ApiID,
            Name:          publicPlanDto.Name,
            Visibility:    true,
            Type:          publicPlanDto.Type,
            Rate:          publicPlanDto.Rate,
            RateUnite:     publicPlanDto.RateUnite,
            RecomndedPlan: publicPlanDto.RecomndedPlan,
            Price:         publicPlanDto.Price,
            // Add other fields as needed
        }

        
        newPlans = append(newPlans, newPlan)
    }

    for _, objectListDto := range planDto.ObjectList {
        // Convert ObjectListDto to ObjectPlanEntity
        newObjectPlan := models.ObjectPlanEntity{
            ID :          objectListDto.ID,
            ApiID:        planDto.ApiID,
            Name:         objectListDto.Name,
            AllEndpoints: true,
            Description:  objectListDto.Description,
            // Add other fields as needed
        }

        for _,CrossObjectListDto := range objectListDto.Cross {

            newCrossObject := models.CrossObjectEntity{
                ObjectID:   objectListDto.ID,
                LimitFee:   CrossObjectListDto.LimitFee,
                LimitType:  CrossObjectListDto.LimitType,
                Price:      CrossObjectListDto.Price,
                QuotaType:  CrossObjectListDto.QuotaType,
                QuotaValue: CrossObjectListDto.QuotaValue,
                Add:        CrossObjectListDto.Add,
                // Add other fields as needed
            }
            newCrossObjects = append(newCrossObjects, newCrossObject)
        }

        newObjectPlans = append(newObjectPlans, newObjectPlan)
    }



    // Insert plans into the database

        if err := s.gormDB.Create(&newPlans).Error; err != nil {
            log.Println("Error creating API Plan service:", err)
            return nil,err
        }
    

    // Insert object plans into the database

        if err := s.gormDB.Create(&newObjectPlans).Error; err != nil {
            log.Println("Error creating API Object Plan service:", err)
            return nil,err
        }
    
    // Insert cross objects into the database
        if err := s.gormDB.Create(&newCrossObjects).Error; err != nil {
            log.Println("Error creating API Cross Object service:", err)
            return nil,err
        }
    

    // Return the newly created plans and object plans
    return newPlans,nil
}


func (s *Service) GetApiPlans(ctx context.Context, apiID int) (*types.ApiPlansResponse, error) {
    var apiPlansResponse types.ApiPlansResponse

    // Get plans for the API
    if err := s.gormDB.Where("api_id = ?", apiID).Find(&apiPlansResponse.Plans).Error; err != nil {
        return nil, err
    }

    // Get object plans for the API
    if err := s.gormDB.Where("api_id = ?", apiID).Preload("Cross").Find(&apiPlansResponse.ObjectPlans).Error; err != nil {
        return nil, err
    }

    return &apiPlansResponse, nil
}

func (s *Service) UpdateApiPlan(ctx context.Context, planDto types.PlansDto) ([]models.PlanEntity, error) {
    // Fetch existing plans
    var existingPlans []models.PlanEntity
    if err := s.gormDB.Where("api_id = ?", planDto.ApiID).Find(&existingPlans).Error; err != nil {
        return nil, err
    }

    // Update plans based on DTO
    for _, dtoPlan := range planDto.PublicPlans {
        for i := range existingPlans {
            if existingPlans[i].ID == dtoPlan.ID {
                existingPlans[i].Name = dtoPlan.Name
                existingPlans[i].Visibility = true
                existingPlans[i].Type = dtoPlan.Type
                existingPlans[i].Rate = dtoPlan.Rate
                existingPlans[i].RateUnite = dtoPlan.RateUnite
                existingPlans[i].RecomndedPlan = dtoPlan.RecomndedPlan
                existingPlans[i].Price = dtoPlan.Price
                // Update other fields as needed
                break
            }
        }
    }

    // Fetch existing object plans
    var existingObjectPlans []models.ObjectPlanEntity
    if err := s.gormDB.Where("api_id = ?", planDto.ApiID).Find(&existingObjectPlans).Error; err != nil {
        return nil, err
    }

    // Update object plans based on DTO
    for _, dtoObjectPlan := range planDto.ObjectList {
        for i := range existingObjectPlans {
            if existingObjectPlans[i].ID == dtoObjectPlan.ID {
                existingObjectPlans[i].Name = dtoObjectPlan.Name
                existingObjectPlans[i].AllEndpoints = true
                existingObjectPlans[i].Description = dtoObjectPlan.Description
                // Update other fields as needed

                // Update cross objects based on DTO
                var existingCrossObjects []models.CrossObjectEntity
                if err := s.gormDB.Where("object_id = ?", existingObjectPlans[i].ID).Find(&existingCrossObjects).Error; err != nil {
                    return nil, err
                }

                for _, dtoCrossObject := range dtoObjectPlan.Cross {
                    for j := range existingCrossObjects {
                        if existingCrossObjects[j].ID == dtoCrossObject.ID {
                            existingCrossObjects[j].ObjectID = existingObjectPlans[i].ID
                            existingCrossObjects[j].LimitFee = dtoCrossObject.LimitFee
                            existingCrossObjects[j].LimitType = dtoCrossObject.LimitType
                            existingCrossObjects[j].Price = dtoCrossObject.Price
                            existingCrossObjects[j].QuotaType = dtoCrossObject.QuotaType
                            existingCrossObjects[j].QuotaValue = dtoCrossObject.QuotaValue
                            existingCrossObjects[j].Add = dtoCrossObject.Add
                            // Update other fields as needed
                            break
                        }
                    }
                }
                // Update cross objects in the database
                if err := s.gormDB.Save(&existingCrossObjects).Error; err != nil {
                    return nil, err
                }

                break
            }
        }
    }

    // Update object plans in the database
    if err := s.gormDB.Save(&existingObjectPlans).Error; err != nil {
        return nil, err
    }

    // Update plans in the database
    if err := s.gormDB.Save(&existingPlans).Error; err != nil {
        return nil, err
    }

    return existingPlans, nil
}


func (s *Service) DeleteApiPlan(ctx context.Context, planID int) error {
    // Check if the item exists before attempting to delete it
    var plan models.PlanEntity
    if err := s.gormDB.First(&plan, planID).Error; err != nil {
        if errors.Is(err, gorm.ErrRecordNotFound) {
            return fmt.Errorf("api plan with id %d not found", planID)
        }
        return err
    }

    // Delete the item from the database
    if err := s.gormDB.Delete(&plan).Error; err != nil {
        return err
    }
    return nil
}

