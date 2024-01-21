package types

// replace with your actual models' package path
import (
	// replace with your actual models' package path
	"local_packages/models"
)

// ApiDto represents the data needed to create a new Api.
type ApiDto struct {
	Name        string
	ProviderID  int
	ImagePath   string
	Description string
	CategoryID  int
	Status		string	// Add other fields as needed...
}

type CategoryDto struct {
	CategoryName        string
	Description string
	// Add other fields as needed...
}

type PlanDto struct {
	Name        string
	ApiID       int
	Price       float64
	Visibility  string
	Type        string
	Description string 
	Recomonded  bool   
	LimiteType  string
	LimiteAmount      int
	LimiteTimeUnit   string
	Features    string 
}

type  EndpointsDto struct {
	GroupID  int
	Methode string
	Group string
	Url string
	Description string
	// Add other fields as needed...
}


type EndpointsGroupDto struct {
	Group string
	ApiID  int
}


type SubscriptionDto struct {
	ApiID  int
	PlanId int
}


// EditApiDto represents the data needed to edit an existing Api.
type UpdateApiDto struct {
	Name        string
	ImagePath   string
	Description string
	
	// Add other fields as needed...
}

type ApiResponse struct {
	Apis []models.ApiEntity `json:"apis"`
	Meta PaginationMeta     `json:"meta"`
}

type PaginationMeta struct {
	TotalItems   int `json:"totalItems"`
	ItemCount    int `json:"itemCount"`
	ItemsPerPage int `json:"itemsPerPage"`
	TotalPages   int `json:"totalPages"`
	CurrentPage  int `json:"currentPage"`
}
type QueryPagination struct {
	Page  int `json:"page"`
	Limit int `json:"limit"`
}



