package models

import (
	//"local_packages/types"
	"local_packages/typesglobale"
	"time"
)

// CategoryEntity represents the Categories table
type CategoryEntity struct {
	ID           int    `gorm:"primaryKey;autoIncrement"` // Set as primary key
	CategoryName string `gorm:"size:255;not null"`
	Description  string
	Apis         []ApiEntity `gorm:"foreignKey:CategoryID"` // Define the foreign key constraint
}

type ApiCollectionEntity struct {
    ID          int    `gorm:"primaryKey;autoIncrement"`
    Name        string `gorm:"size:255;not null"`
    Description string
    Apis        []ApiEntity `gorm:"many2many:api_collections_apis;"` // many-to-many relationship
}



// ApiEntity represents the Apis table
type ApiEntity struct {
	ID          int    `gorm:"primaryKey;autoIncrement"`
	ProviderID  int    `gorm:"not null"`
	Name        string `gorm:"size:255;not null"`
	ImagePath   string
	Description string
	Keywords 	string 
	Visibility  bool `gorm:"default:false"`
	
	ApiUrl 		string
	CategoryID  int             `gorm:"null"`                                                                     
	Collections []ApiCollectionEntity `gorm:"many2many:api_collections_apis;"` // many-to-many relationship
	Status      typesglobale.ApiStatus `gorm:"type:varchar(20);default:'active'"`

	DateCreated time.Time `gorm:"default:CURRENT_TIMESTAMP"`
	LastUpdated time.Time
	DateDeleted time.Time

	ApiVersions   []ApiVersionEntity   `gorm:"foreignKey:ApiID"`
	ApiRatings    []ApiRatingEntity    `gorm:"foreignKey:ApiID"`
	//Subscriptionss []SubscriptionEntity `gorm:"foreignKey:ApiID"`
	//Endpoints     []EndpointsEntity    `gorm:"foreignKey:ApiID"`
	Plans         []PlanEntity         `gorm:"foreignKey:ApiID"`
	ObjectPlan	  []ObjectPlanEntity  `gorm:"foreignKey:ApiID"`
	Groups 	  	  []EndpointsGroupEntity     `gorm:"foreignKey:ApiID"`
	ApiDocs   ApiDocsEntity           `gorm:"foreignKey:ApiID"`  // One-to-one relationship with foreign key

	Category    CategoryEntity  `gorm:"foreignKey:CategoryID"`
}

type ApiDocsEntity struct {
	ID          int    `gorm:"primaryKey;autoIncrement"`
	ApiID  int    `gorm:"not null"`
    Content string `gorm:"type:text"`
	LastUpdated time.Time `gorm:"default:CURRENT_TIMESTAMP"`
	//LastUpdated time.Time
	//DateDeleted time.Time
    // Add other fields as necessary
}



// HealthCheckEntity represents the Health Checks table for scheduling API checks
type HealthCheckEntity struct {
	ID             int       `gorm:"primaryKey;autoIncrement"`
	ApiID          int       `gorm:"unique;not null"` // Foreign key to the ApiEntity, unique to ensure one-to-one relation
	URL            string    `gorm:"size:2048;not null"` // The URL to be checked
	Schedule       string    `gorm:"size:50;not null"` // Cron schedule string for when to run the check
	LastStatus     string    `gorm:"type:varchar(20);default:'pending'"` // Last status of the health check
	LastCheckedAt  time.Time // The timestamp of the last health check
	//NextCheckAt    time.Time // The timestamp of the next scheduled health check
	AlertsEnabled  bool      // Whether alerts are enabled for this health check
//	AlertEndpoints string    `gorm:"size:2048"` // JSON array of endpoints to send alerts to (email, SMS, webhook, etc.)
	//CreatedAt      time.Time `gorm:"default:CURRENT_TIMESTAMP"`
	//UpdatedAt      time.Time
	Results        []HealthCheckResultEntity `gorm:"foreignKey:HealthCheckID"` // One-to-many relation to store results of health checks
}

// HealthCheckResultEntity represents the Health Check Results table for storing results of checks
type HealthCheckResultEntity struct {
	ID              int       `gorm:"primaryKey;autoIncrement"`
	HealthCheckID   int       `gorm:"not null"` // Foreign key to the HealthCheckEntity
	Status          string    `gorm:"type:varchar(20);not null"` // Status of the check (success, failure)
	ResponseTime    int       // Response time in milliseconds
	StatusMessage   string    // A message describing the status (error message, success, etc.)
	CheckedAt       time.Time `gorm:"default:CURRENT_TIMESTAMP"` // The timestamp of when the check was performed
}


type EndpointsGroupEntity struct {
	ID          int    `gorm:"primaryKey;autoIncrement"`
	ApiID       int    `gorm:"not null"`
	Group string
	Description string
	Endpoints []EndpointsEntity `gorm:"foreignKey:GroupID"`
}


type EndpointsEntity struct {
	ID          int    `gorm:"primaryKey;autoIncrement"`
	GroupID       int   `gorm:"not null"`
	Methode     string `gorm:"size:255;not null"`
	Name 		string `gorm:"size:255;null"`
	
	Url         string `gorm:"size:255;not null"`
	Description string

	Group       EndpointsGroupEntity      `gorm:"foreignKey:GroupID"`  // Add this line
	Parameters  []EndpointsParameterEntity `gorm:"foreignKey:EndpointID"` // query, header,Path ,  body
    BodyParam   BodyParamEntity           `gorm:"foreignKey:EndpointID"`  // One-to-one relationship with foreign key
//	Objects		[]EndpointObjectEntity	`gorm:"foreignKey:EndpointID"` 
	// Add other fields as needed...
}



type EndpointsParameterEntity struct {
    ID         int    `gorm:"primaryKey;autoIncrement"`
    EndpointID int    `gorm:"null"`
    Key        string `gorm:"size:255;not null"`
	ValueType     string `gorm:"size:255"` // e.g., string, int, boolean
	ParameterType     string `gorm:"size:255"` // e.g., Query, Header, 
	ExampleValue     string `gorm:"size:255"`
	Required	 bool `gorm:"default:false"`
    // Add other fields as needed...
}


type BodyParamEntity struct {
	ID         int    `gorm:"primaryKey;autoIncrement"`
    EndpointID int    `gorm:"not null"`
	ContentType  string `gorm:"size:255;not null"` // Content type (e.g., text/plain, application/json, multipart/form-data)
    TextBody     string `gorm:"type:text"` 	// For text/plain content type  
  //  MediaFileID  int      // Add other fields as needed...
}














// ApiVersionEntity represents the ApiVersions table
type ApiVersionEntity struct {
	ID int `gorm:"primaryKey;autoIncrement"`
	//VersionID     int            `gorm:"primaryKey;autoIncrement"`
	ApiID         int    `gorm:"not null"`
	VersionNumber string `gorm:"size:255;not null"`
	ReleaseDate   time.Time
	WhatsNew      string
}

// ApiRatingEntity represents the ApiRatings table
type ApiRatingEntity struct {
	ID int `gorm:"primaryKey;autoIncrement"`
	//RatingID   int              `gorm:"primaryKey;autoIncrement"`
	ApiID     int `gorm:"not null"`
	UserID    int `gorm:"not null"`
	Rating    int `gorm:"not null"`
	Comment   string
	DateRated time.Time `gorm:"default:CURRENT_TIMESTAMP"`
}





type PlanEntity struct {
	ID             int    `gorm:"primaryKey;autoIncrement"`
	ApiID          int    `gorm:"not null"`
	Name           string `gorm:"size:255;not null"`
	Active		   bool 	
	Visibility     bool
	Type           string // free or paid
	Rate           int
	RateUnite      string
	RecomndedPlan  bool
	Price          float64 `gorm:"type:decimal(10,2)"`
//	Subscriptions  []SubscriptionEntity `gorm:"foreignKey:PlanID"`
}


type ObjectPlanEntity struct {
	ID 			int    `gorm:"primaryKey;autoIncrement"`
	ApiID       int    `gorm:"not null"`
	Name        string `gorm:"size:255;not null"`
	Description string
	Cross       []CrossObjectEntity `gorm:"foreignKey:ObjectID"`
	EndpointList []EndpointObjectEntity `gorm:"foreignKey:ObjectID"`
	AllEndpoints bool 
}



// CrossObjectEntity represents the CrossObjects table
type CrossObjectEntity struct {
	ID         int    `gorm:"primaryKey;autoIncrement"`
	ObjectID   int    `gorm:"not null"`
	LimitFee   int
	LimitType  string
	Price      float64 `gorm:"type:decimal(10,2)"`
	QuotaType  string
	QuotaValue float64 `gorm:"type:decimal(10,2)"`
	Add 	  bool 		`gorm:"default:false"`
	Object    ObjectPlanEntity `gorm:"foreignKey:ObjectID"`
	// Add other fields related to cross objects
}

// EndpointObjectEntity represents the EndpointObjects table
type EndpointObjectEntity struct {
	ID       int    `gorm:"primaryKey;autoIncrement"`
	ObjectID int    `gorm:"not null"`
	EndpointsID int `gorm:"not null"`
	// Add other fields related to endpoint objects
}

// SubscriptionEntity represents the Subscriptions table
type SubscriptionEntity struct {
	ID int `gorm:"primaryKey;autoIncrement"`
	//SubscriptionID int            `gorm:"primaryKey;autoIncrement"`
	UserID    int `gorm:"not null"`
	ApiID     int `gorm:"not null"`
	PlanID    int `gorm:"not null"`
	StartDate time.Time
	EndDate   time.Time
	Status    string           `gorm:"size:50"`
	ApiKeys   []ApiKeyEntity   `gorm:"foreignKey:SubscriptionID"`
	UsageLogs []UsageLogEntity `gorm:"foreignKey:SubscriptionID"`
}


// ApiKeyEntity represents the ApiKeys table
type ApiKeyEntity struct {
	ID int `gorm:"primaryKey;autoIncrement"`
	//ApiKeyID       int            `gorm:"primaryKey;autoIncrement"`
	SubscriptionID int       `gorm:"not null"`
	ApiKey         string    `gorm:"size:255;unique;not null"`
	CreationDate   time.Time `gorm:"default:CURRENT_TIMESTAMP"`
	IsActive       bool      `gorm:"default:true"`
}

// UsageLogEntity represents the UsageLogs table
type UsageLogEntity struct {
	ID int `gorm:"primaryKey;autoIncrement"`
	//LogID          int            `gorm:"primaryKey;autoIncrement"`
	SubscriptionID int       `gorm:"not null"`
	Timestamp      time.Time `gorm:"default:CURRENT_TIMESTAMP"`
	Endpoint       string
	DataVolume     int
	ResponseTime   int
}
