package services

import (
	//"auth/security"
	"context"
	"errors"
	"fmt"
	"local_packages/api/types"
	"local_packages/models"
	"local_packages/typesglobale"
	"log"

	"github.com/jackc/pgx/v4/pgxpool"
	"gorm.io/gorm"
)


var (
	ErrInvalidUser  = errors.New("invalid user")
	ErrInvalidToken = errors.New("invalid token")
)

type Service struct {
	db     *pgxpool.Pool
	gormDB *gorm.DB
}

func NewService(db *pgxpool.Pool, gormDB *gorm.DB) *Service {
	return &Service{
		db:     db,
		gormDB: gormDB,
	}
}

func (s *Service) GetOne(ctx context.Context, id int) (*models.ApiEntity, error) {
    // Implement the logic to retrieve an item by ID from the database.
    // You can use s.db and s.gormDB to interact with the database.
    // Replace the placeholder logic with your actual database query.

    var api models.ApiEntity
    if err := s.gormDB.Preload("ApiDocs").Preload("Category").Where("id = ?", id).First(&api).Error; err != nil {
        return nil, err
    }

    return &api, nil
}

func (s *Service) GetAll(ctx context.Context, page int, limit int) (types.ApiResponse, error) {
	// Set a default limit if it's not specified or if it's <= 0.
	//limit := query.Limit
	//page := query.Page
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
	if err := s.gormDB.Model(&models.ApiEntity{}).Count(&totalItems).Error; err != nil {
		return types.ApiResponse{}, err
	}

	var apis []models.ApiEntity
	if err := s.gormDB.Offset(offset).Limit(limit).Find(&apis).Error; err != nil {
		return types.ApiResponse{}, err
	}


	totalPages := (int(totalItems) + limit - 1) / limit // Calculate total pages.

	response := types.ApiResponse{
		Apis: apis,
		Meta: types.PaginationMeta{
			TotalItems:   int(totalItems),
			ItemCount:    len(apis),
			ItemsPerPage: limit,
			TotalPages:   totalPages,
			CurrentPage:  page,
		},
	}

	return response, nil
}

func (s *Service) GetUserAPIs(ctx context.Context, userID int) ([]models.ApiEntity, error) {
    // Retrieve the APIs associated with the specified user ID as the provider
    var userApis []models.ApiEntity
    if err := s.gormDB.Where("provider_id = ?", userID).Find(&userApis).Error; err != nil {
        return nil, err
    }

    return userApis, nil
}


func (s *Service) Create(ctx context.Context, item types.ApiDto) (*models.ApiEntity, error) {
	// Implement the logic to create a new item in the database.
	// You can use s.db and s.gormDB to interact with the database.
	// Replace the placeholder logic with your actual database insertion.
	newApi := models.ApiEntity{
		ProviderID:  item.ProviderID,
		Name:        item.Name,
        ApiUrl:      item.ApiUrl,
        Keywords:    item.Keywords,
		ImagePath:   item.ImagePath,
		Description: item.Description,
		CategoryID:  item.CategoryID,
        Visibility:  item.Visibility,
		// Set other fields as needed
	}

	if err := s.gormDB.Create(&newApi).Error; err != nil {
		return nil, err
	}


    // Create associated ApiDocsEntity with empty content
	newApiDocs := models.ApiDocsEntity{
		ApiID:   newApi.ID,
		Content: newApi.Name + " Docs", // You can set the default content here
		// Set other fields as needed
	}

	if err := s.gormDB.Create(&newApiDocs).Error; err != nil {
		return nil, err
	}


    newGroup := models.EndpointsGroupEntity{
        ID: newApi.ID,
        ApiID: newApi.ID,
        Group: "Default",
    }
    if err := s.gormDB.Create(&newGroup).Error; err != nil {
		return nil, err
	}
	return &newApi, nil
}

func (s *Service) Update(ctx context.Context, id int, item types.ApiDto) (*models.ApiEntity, error) {
	// Implement the logic to edit an existing item in the database.
	// You can use s.db and s.gormDB to interact with the database.
	// Replace the placeholder logic with your actual database update.
	var api models.ApiEntity
	if err := s.gormDB.Where("id = ?", id).First(&api).Error; err != nil {
		return nil, err
	}

	// Update fields based on item

	if  item.Name != "" {
		api.Name = item.Name
	}
	
	if  item.Description != "" {
		api.Description = item.Description
	}
	
	if item.ImagePath != "" {
		api.ImagePath = item.ImagePath
	}
	

	
	if item.Status == "active" {
	    api.Status = typesglobale.StatusActive
	} else {
		api.Status = typesglobale.StatusInactive
	}
		
    api.Visibility = item.Visibility



	// Update other fields as needed

	if err := s.gormDB.Save(&api).Error; err != nil {
		return nil, err
	}
	return &api, nil
}

func (s *Service) Delete(ctx context.Context, id int) error {
   // Check if the item exists before attempting to delete it
   var apiEntity models.ApiEntity
   if err := s.gormDB.First(&models.ApiEntity{}, id).Error; err != nil {
	   if errors.Is(err, gorm.ErrRecordNotFound) {
		   return fmt.Errorf("item with id %d not found", id)
	   }
	   return err
   }

   // Delete the item from the database
   if err := s.gormDB.Delete(&apiEntity).Error; err != nil {
	   return err
   }
   return nil
}


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


func (s *Service) GetApiPlans(ctx context.Context, apiID int) ([]models.PlanEntity, error) {
    var plans []models.PlanEntity

    if err := s.gormDB.Where("api_id = ?", apiID).Find(&plans).Error; err != nil {
        return nil, err
    }

    return plans, nil
}

func (s *Service) UpdateApiPlan(ctx context.Context, planID int, planDto types.PlanDto) (*models.PlanEntity, error) {
    var existingPlan models.PlanEntity
    if err := s.gormDB.First(&existingPlan, planID).Error; err != nil {
        if errors.Is(err, gorm.ErrRecordNotFound) {
            return nil, errors.New("api plan not found")
        }
        return nil, err
    }
/*

     // Update fields
	if (planDto.Name  != "") {
        existingPlan.Name = planDto.Name 
        }
        if (planDto.Type != "") {
    
        existingPlan.Type = planDto.Type
        }
        if (planDto.LimiteType != "") {
    
        existingPlan.LimiteType = planDto.LimiteType
        }
        if (planDto.LimiteAmount != 0) {
        existingPlan.LimiteAmount = planDto.LimiteAmount
        }
        if (planDto.LimiteTimeUnit != "") {
        existingPlan.LimiteTimeUnit = planDto.LimiteTimeUnit
        }
        if (planDto.Features != "") {
        existingPlan.Features = planDto.Features
                        }
        if (planDto.Description != "") {
        existingPlan.Description = planDto.Description
        }
        if (! planDto.Recomonded ) {
        existingPlan.Recomonded = planDto.Recomonded
        }
        if (planDto.Price != 0) {
        existingPlan.Price = planDto.Price
        }
        if (planDto.Visibility != "") {
        existingPlan.Visibility = planDto.Visibility
        }
        if (planDto.LimiteType != "") {
            existingPlan.LimiteType = planDto.LimiteType
        }
        //  other fields as needed
        */
    // Updae fields from planDto
    // ExampleexistingPlan.PlanName = planDto.PlanName if planDto.PlanName != ""
    // Add other fields as needed

    if err := s.gormDB.Save(&existingPlan).Error; err != nil {
     return nil, err
    }

    return &existingPlan, nil
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


// ----------------------------- API Subscription CRUD -----------------------------

func (s *Service) CreateApiSubscription(ctx context.Context, subscription types.SubscriptionDto) (*models.SubscriptionEntity, error) {
    newSubscription := models.SubscriptionEntity{
        UserID: 1,
        PlanID: subscription.PlanId,
        ApiID: subscription.ApiID,

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











