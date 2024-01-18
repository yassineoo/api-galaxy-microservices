package api

import (
	//"auth/security"
	"context"
	"errors"
	"fmt"
	"local_packages/models"
	"local_packages/types"

	"github.com/jackc/pgx/v4/pgxpool"
	"gorm.io/gorm"
)

type ApiService interface {
	// GetOne retrieves a single item by its ID.
	//GetOne(ctx context.Context, id string) (*models.ApiEntity, error)

	// GetAll retrieves all items.
	//GetAll(ctx context.Context , query QueryPagination) (ApiResponse, error)

	// Create adds a new item.
	//Create(ctx context.Context, item CreateApiDto) (*models.ApiEntity, error)

	// Edit updates an item identified by the given ID.
	//Edit(ctx context.Context, id string, item EditApiDto) (*models.ApiEntity, error)

	// Delete removes an item based on its ID.
	Delete(ctx context.Context, id string) error
}

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
	if err := s.gormDB.Where("id = ?", id).First(&api).Error; err != nil {
		return nil, err
	}
	return &api, nil
}

func (s *Service) GetAll(ctx context.Context, page int, limit int) (ApiResponse, error) {
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
		return ApiResponse{}, err
	}

	var apis []models.ApiEntity
	if err := s.gormDB.Offset(offset).Limit(limit).Find(&apis).Error; err != nil {
		return ApiResponse{}, err
	}


	totalPages := (int(totalItems) + limit - 1) / limit // Calculate total pages.

	response := ApiResponse{
		Apis: apis,
		Meta: PaginationMeta{
			TotalItems:   int(totalItems),
			ItemCount:    len(apis),
			ItemsPerPage: limit,
			TotalPages:   totalPages,
			CurrentPage:  page,
		},
	}

	return response, nil
}

func (s *Service) Create(ctx context.Context, item CreateApiDto) (*models.ApiEntity, error) {
	// Implement the logic to create a new item in the database.
	// You can use s.db and s.gormDB to interact with the database.
	// Replace the placeholder logic with your actual database insertion.
	newApi := models.ApiEntity{
		ProviderID:  item.ProviderID,
		Name:        item.Name,
		ImagePath:   item.ImagePath,
		Description: item.Description,
		CategoryID:  item.CategoryID,
		// Set other fields as needed
	}
	if err := s.gormDB.Create(&newApi).Error; err != nil {
		return nil, err
	}
	return &newApi, nil
}

func (s *Service) Update(ctx context.Context, id int, item UpdateApiDto) (*models.ApiEntity, error) {
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
			api.Status = types.StatusActive
		} else {
			api.Status = types.StatusInactive
		}
		
	 



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
		   return fmt.Errorf("Item with ID %d not found", id)
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
func (s *Service) CreateCategory(ctx context.Context, category CategoryDto) (*models.CategoryEntity, error) {
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


func (s *Service) UpdateCategory(ctx context.Context, id int, category CategoryDto) (*models.CategoryEntity, error) {
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
