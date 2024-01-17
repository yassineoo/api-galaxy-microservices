package apiService

import (
	//"auth/security"
	"context"
	"errors"

	"github.com/jackc/pgx/v4/pgxpool"
	"gorm.io/gorm"
)

type ApiService interface {
 // GetOne retrieves a single item by its ID.
 GetOne(ctx context.Context, id string) (*ApiEntity, error)

 // GetAll retrieves all items.
 GetAll(ctx context.Context , query QueryPagination) (ApiResponse, error)

 // Create adds a new item.
 Create(ctx context.Context, item CreateApiDto) (*ApiEntity, error)

 // Edit updates an item identified by the given ID.
 Edit(ctx context.Context, id string, item EditApiDto) (*ApiEntity, error)

 // Delete removes an item based on its ID.
 Delete(ctx context.Context, id string) error
}



var (
    ErrInvalidUser  = errors.New("invalid user")
    ErrInvalidToken = errors.New("invalid token")
)

type service struct {
    db       *pgxpool.Pool
    gormDB   *gorm.DB
}

func NewService(db *pgxpool.Pool, gormDB *gorm.DB) *service {
	return &service{
		db:     db,
		gormDB: gormDB,
	}
}







func (s *service) GetOne(ctx context.Context, id string) (*ApiEntity, error) {
    // Implement the logic to retrieve an item by ID from the database.
    // You can use s.db and s.gormDB to interact with the database.
    // Replace the placeholder logic with your actual database query.
    var api ApiEntity
    if err := s.gormDB.Where("id = ?", id).First(&api).Error; err != nil {
        return nil, err
    }
    return &api, nil
}

func (s *service) GetAll(ctx context.Context, query QueryPagination) (ApiResponse, error) {
    // Set a default limit if it's not specified or if it's <= 0.
    limit := query.Limit
    page := query.Page
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
    if err := s.gormDB.Model(&ApiEntity{}).Count( &totalItems ).Error; err != nil {
        return ApiResponse{}, err
    }

    var apis []ApiEntity
    if err := s.gormDB.Offset(offset).Limit(limit).Find(&apis).Error; err != nil {
        return ApiResponse{}, err
    }

    totalPages := (int( totalItems) + limit - 1) / limit // Calculate total pages.

    response := ApiResponse{
        Data: apis,
        Meta: PaginationMeta   {
            TotalItems:    int(totalItems),
            ItemCount:     len(apis),
            ItemsPerPage:  limit,
            TotalPages:    totalPages,
            CurrentPage:   page,
        },
    }

    return response, nil
}

func (s *service) Create(ctx context.Context, item CreateApiDto) (*ApiEntity, error) {
    // Implement the logic to create a new item in the database.
    // You can use s.db and s.gormDB to interact with the database.
    // Replace the placeholder logic with your actual database insertion.
    newApi := ApiEntity{
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

func (s *service) Edit(ctx context.Context, id string, item EditApiDto) (*ApiEntity, error) {
    // Implement the logic to edit an existing item in the database.
    // You can use s.db and s.gormDB to interact with the database.
    // Replace the placeholder logic with your actual database update.
    var api ApiEntity
    if err := s.gormDB.Where("id = ?", id).First(&api).Error; err != nil {
        return nil, err
    }

    // Update fields based on item
    api.Name = item.Name
    api.Description = item.Description
    // Update other fields as needed

    if err := s.gormDB.Save(&api).Error; err != nil {
        return nil, err
    }
    return &api, nil
}

func (s *service) Delete(ctx context.Context, id string) error {
    // Implement the logic to delete an item by ID from the database.
    // You can use s.db and s.gormDB to interact with the database.
    // Replace the placeholder logic with your actual database deletion.
    if err := s.gormDB.Delete(&ApiEntity{}, "id = ?", id).Error; err != nil {
        return err
    }
    return nil
}

