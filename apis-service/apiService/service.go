package apiService

import (
	//"auth/security"
	"context"
	"errors"
    "github.com/jackc/pgx/v4/pgxpool"
)

type ApiService interface {
 // GetOne retrieves a single item by its ID.
 GetOne(ctx context.Context, id string) (*ApiDto, error)

 // GetAll retrieves all items.
 GetAll(ctx context.Context) ([]ApiDto, error)

 // Create adds a new item.
 Create(ctx context.Context, item CreateApiDto) (*ApiDto, error)

 // Edit updates an item identified by the given ID.
 Edit(ctx context.Context, id string, item EditApiDto) (*ApiDto, error)

 // Delete removes an item based on its ID.
 Delete(ctx context.Context, id string) error
}



var (
	ErrInvalidUser  = errors.New("Invalid user")
	ErrInvalidToken = errors.New("Invalid token")
)

type service struct {
	db *pgxpool.Pool
}

func NewService(db *pgxpool.Pool) ApiService {
	return &service{
		db: db,
	}
}




func (s *service) GetOne(ctx context.Context, id string) (*ApiDto, error) {
    // Implement the logic to retrieve an item by ID.
    // For now, returning a placeholder item and nil error.
    return &ApiDto{ID: id, Name: "Sample API"}, nil
}

func (s *service) GetAll(ctx context.Context) ([]ApiDto, error) {
    // Implement the logic to retrieve all items.
    // Returning a slice of sample items for illustration.
    items := []ApiDto{
        {ID: "1", Name: "API One"},
        {ID: "2", Name: "API Two"},
    }
    return items, nil
}

func (s *service) Create(ctx context.Context, item CreateApiDto) (*ApiDto, error) {
    // Implement the logic to create a new item.
    // Returning a new item for demonstration.
    newItem := ApiDto{ID: "new-id", Name: item.Name}
    return &newItem, nil
}

func (s *service) Edit(ctx context.Context, id string, item EditApiDto) (*ApiDto, error) {
    // Implement the logic to edit an existing item.
    // For demonstration, returning an edited item.
    editedItem := ApiDto{ID: id, Name: item.Name}
    return &editedItem, nil
}

func (s *service) Delete(ctx context.Context, id string) error {
    // Implement the logic to delete an item by ID.
    // Returning nil to indicate successful deletion.
    return nil
}


