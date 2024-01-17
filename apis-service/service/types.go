package service

// replace with your actual models' package path
import (
	// replace with your actual models' package path
	"local_packages/models"
)

// CreateApiDto represents the data needed to create a new Api.
type CreateApiDto struct {
    Name        string
    ProviderID  int
    ImagePath   string
    Description string
    CategoryID  int
    // Add other fields as needed...
}

// EditApiDto represents the data needed to edit an existing Api.
type UpdateApiDto struct {
    Name        string
    ImagePath   string
    Description string
    // Add other fields as needed...
}



type ApiResponse struct {
    Data [] models.ApiEntity `json:"data"`
    Meta PaginationMeta `json:"meta"`
}

type PaginationMeta struct {
    TotalItems    int `json:"totalItems"`
    ItemCount     int `json:"itemCount"`
    ItemsPerPage  int `json:"itemsPerPage"`
    TotalPages    int `json:"totalPages"`
    CurrentPage   int `json:"currentPage"`
} 
type QueryPagination struct { 
    Page int `json:"page"`
    Limit int `json:"limit"`
}