package types

// replace with your actual models' package path
import (
	// replace with your actual models' package path
	"local_packages/models"
	"time"
)

// ApiDto represents the data needed to create a new Api.
type ApiDto struct {
	Name        string
	ProviderID  int
	ImagePath   string
	ApiUrl 		string
	Keywords 	string
	Description string
	CategoryID  int
	Status		string	// Add other fields as needed...
}


type ApiDocsDto struct {
	ApiID  int
	//Version string
	Content string
	// Add other fields as needed...
}
type CategoryDto struct {
	CategoryName        string
	Description string
	// Add other fields as needed...
}
type ApiCollectionDto struct {
	Name        string
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
	ApiID  int
	GroupID  int
	Methode string
	Name string
	Url string
	Description string
	Parameters []EndpointsParameterDto
	// Add other fields as needed...
}


type EndpointsGroupDto struct {
	Group string
	ApiID  int
	Description string
}

type EndpointsParameterDto struct {
	EndpointID  int
	Key string
	ValueType string
	ParameterType string
	Required bool
	ExampleValue string
}
// BodyParamDto represents the data transfer object for a body parameter.
type BodyParamDto struct {
	EndpointID  int                  `json:"endpoint_id"`
	ContentType string               `json:"content_type"`
	TextBody    string               `json:"text_body"`
	Parameters  []EndpointsParameterDto `json:"parameters"`
}



// HealthCheckDto is used to transfer health check data.
type HealthCheckDto struct {
	ApiID          int       `json:"apiId" binding:"required"`        // The ID of the API for which the health check is being set up
	URL            string    `json:"url" binding:"required,url"`      // The URL to be checked
	Schedule       string    `json:"schedule" binding:"required"`     // Cron schedule string for when to run the check
	LastStatus     string    `json:"lastStatus"`                      // The last status of the health check
	LastCheckedAt  time.Time `json:"lastCheckedAt"`                   // The timestamp of the last health check
	NextCheckAt    time.Time `json:"nextCheckAt"`                     // The timestamp of the next scheduled health check
	AlertsEnabled  bool      `json:"alertsEnabled"`                   // Whether alerts are enabled for this health check
	//AlertEndpoints []string  `json:"alertEndpoints"`                  // A list of endpoints to send alerts to (email, SMS, webhook, etc.)
}

type HealthCheckResultDto struct {
	HealthCheckID int       `json:"healthCheckId" binding:"required"` // The ID of the health check for which the result is being set up
	Status        string    `json:"status" binding:"required"`        // The status of the check (success, failure)
	ResponseTime  int       `json:"responseTime"`                     // Response time in milliseconds
	StatusMessage string    `json:"statusMessage"`                    // A message describing the status (error message, success, etc.)
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



