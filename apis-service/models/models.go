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
	Apis         []ApiEntity `gorm:"foreignKey:CategoryID;onDelete:CASCADE"` // Define the foreign key constraint
}

type ApiCollectionEntity struct {
    ID          int    `gorm:"primaryKey;autoIncrement"`
    Name        string `gorm:"size:255;not null"`
    Description string
	ImagePath   string

    Apis        []ApiEntity `gorm:"many2many:api_collections_apis;"` // many-to-many relationship
}



// UserEntity represents the Users table
type UserEntity struct {
	ID            int       `gorm:"primaryKey;autoIncrement"`
	Username      string    `gorm:"size:255;not null"`
	Email         string    `gorm:"size:255;unique;not null"`
	PasswordHash  string    `gorm:"size:60"` // Optional, so no `not null`
	DateCreated   time.Time `gorm:"default:CURRENT_TIMESTAMP"`
	LastLogin     time.Time
	IsActive      bool      `gorm:"default:true"`
	IsTwoFactor   bool      `gorm:"default:false"`
	Role          string    `gorm:"size:50"`
	PhoneNumber   string    `gorm:"size:20;unique"`
	Verified      bool      `gorm:"default:false"`
	Image         string    `gorm:"size:255"`
	StripeCustomerID string  `gorm:"size:255"`
	// Add the billinghistory relation when it's defined
	 Apis []ApiEntity `gorm:"foreignKey:ProviderID"`
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

	ApiVersions   []ApiVersionEntity   `gorm:"foreignKey:ApiID;onDelete:CASCADE"`
	ApiReviews    []ApiReviewEntity    `gorm:"foreignKey:ApiID;onDelete:CASCADE"`
	//Subscriptionss []SubscriptionEntity `gorm:"foreignKey:ApiID;onDelete:CASCADE"`
	//Endpoints     []EndpointsEntity    `gorm:"foreignKey:ApiID;onDelete:CASCADE"`
	Plans         []PlanEntity         `gorm:"foreignKey:ApiID;onDelete:CASCADE"`
	ObjectPlan	  []ObjectPlanEntity  `gorm:"foreignKey:ApiID;onDelete:CASCADE"`
	Groups 	  	  []EndpointsGroupEntity     `gorm:"foreignKey:ApiID;onDelete:CASCADE"`
	ApiDocs   ApiDocsEntity           `gorm:"foreignKey:ApiID;onDelete:CASCADE"` // One-to-one relationship with foreign key
	HealthCheck   HealthCheckEntity `gorm:"foreignKey:ApiID;onDelete:CASCADE"` // One-to-many relationship with foreign key

	Category    CategoryEntity  `gorm:"foreignKey:CategoryID"`
	User        UserEntity `gorm:"foreignKey:ProviderID"`

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
	//URL            string    `gorm:"size:2048;not null"` // The URL to be checked
	//Schedule       string    `gorm:"size:50;not null"` // Cron schedule string for when to run the check
	LastStatus     string    `gorm:"type:varchar(20);default:'pending'"` // Last status of the health check
	LastCheckedAt  time.Time // The timestamp of the last health check
	//NextCheckAt    time.Time // The timestamp of the next scheduled health check
	AlertsEnabled  bool      // Whether alerts are enabled for this health check
//	AlertEndpoints string    `gorm:"size:2048"` // JSON array of endpoints to send alerts to (email, SMS, webhook, etc.)
	EndpointID	int `gorm:"not null"`
	Endpoint		EndpointsEntity `gorm:"foreignKey:EndpointID"`
	//CreatedAt      time.Time `gorm:"default:CURRENT_TIMESTAMP"`
	//UpdatedAt      time.Time
	Email 		string
	//Api		 ApiEntity `gorm:"foreignKey:ApiID"`
	Results        []HealthCheckResultEntity `gorm:"foreignKey:HealthCheckID;onDelete:CASCADE"` // One-to-many relation to store results of health checks
}

// HealthCheckResultEntity represents the Health Check Results table for storing results of checks
type HealthCheckResultEntity struct {
	ID              int       `gorm:"primaryKey;autoIncrement"`
	HealthCheckID   int       `gorm:"not null"` // Foreign key to the HealthCheckEntity
	Status          string    `gorm:"type:varchar(20);not null"` // Status of the check (success, failure)
	ResponseTime    int       // Response time in milliseconds
	HealthCheck     HealthCheckEntity `gorm:"foreignKey:HealthCheckID"` // Add this line
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
	Parameters  []EndpointsParameterEntity `gorm:"foreignKey:EndpointID;onDelete:CASCADE"` // query, header,Path ,  body
    BodyParam   BodyParamEntity           `gorm:"foreignKey:EndpointID;onDelete:CASCADE"` 
	Logs 		[]UsageLogEntity		`gorm:"foreignKey:EndpointID;onDelete:CASCADE"`
	HealthCheck []HealthCheckEntity 		`gorm:"foreignKey:EndpointID;onDelete:CASCADE"`
	// One-to-one relationship with foreign key
	//Objects		[]EndpointObjectEntity	`gorm:"foreignKey:EndpointID"` 
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
type ApiReviewEntity struct {
	ID int `gorm:"primaryKey;autoIncrement"`
	//RatingID   int              `gorm:"primaryKey;autoIncrement"`
	ApiID     int `gorm:"not null"`
	UserID    int `gorm:"not null"`
	Rating    int `gorm:"not null"`
	Comment   string
	DateRated time.Time `gorm:"default:CURRENT_TIMESTAMP"`
	Api       ApiEntity `gorm:"foreignKey:ApiID"`
	User      UserEntity `gorm:"foreignKey:UserID"`
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
	StripePriceID  string  `gorm:"size:255"`
	Subscriptions  []SubscriptionEntity `gorm:"foreignKey:PlanID"`
}


type ObjectPlanEntity struct {
	ID 			int    `gorm:"primaryKey;autoIncrement"`
	ApiID       int    `gorm:"not null"`
	Name        string `gorm:"size:255;not null"`
	Description string
	Cross       []CrossObjectEntity `gorm:"foreignKey:ObjectID;onDelete:CASCADE"`
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
	QuotaValue int 
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
	PlanID    int `gorm:"not null"`
	StartDate time.Time
	EndDate   time.Time
	UsedCalls  int    // Number of calls used
	Status    string           `gorm:"size:50"`
	StripeSubID     string `gorm:"size:255"`
	UsageLogs []UsageLogEntity `gorm:"foreignKey:SubscriptionID;onDelete:CASCADE"`
	Plan     PlanEntity `gorm:"foreignKey:PlanID"`

}



// UsageLogEntity represents the UsageLogs table
type UsageLogEntity struct {
	ID int `gorm:"primaryKey;autoIncrement"`
	//LogID          int            `gorm:"primaryKey;autoIncrement"`
	SubscriptionID int       `gorm:"not null"`
	Timestamp      time.Time `gorm:"default:CURRENT_TIMESTAMP"`
	EndpointID int    `gorm:"not null"`
	Status 		int    // status code of the response
	ResponseTime   int  // in ms 
	Endpoint    EndpointsEntity  `gorm:"foreignKey:EndpointID"`

}


type InvoiceEntity struct {
	ID      uint                 `gorm:"primaryKey;autoIncrement"`
	SubscriptionID uint
	TotalAmount    float64              `gorm:"type:decimal(10,2)"`
	DateIssued     time.Time            `gorm:"default:current_timestamp"`
	DueDate        time.Time
	Status         string               `gorm:"type:varchar(50)"`
	StripeInvoiceID string             `gorm:"size:255"`
	BillingHistory []BillingHistoryEntity `gorm:"foreignKey:InvoiceID"`
	Subscription   SubscriptionEntity     `gorm:"foreignKey:SubscriptionID;constraint:OnUpdate:RESTRICT"`
	Transactions   []TransactionEntity    `gorm:"foreignKey:InvoiceID"`
}

type PaymentMethodEntity struct {
	ID uint                 `gorm:"primaryKey;autoIncrement"`
	UserID          uint
	Provider        string               `gorm:"type:varchar(255)"`
	AccountDetails  string               `gorm:"type:text"`
	IsDefault       bool                 `gorm:"default:false"`
	StripePaymentMethodID string         `gorm:"size:255"`
	User            UserEntity           `gorm:"foreignKey:UserID;constraint:OnUpdate:RESTRICT"`
	Transactions    []TransactionEntity  `gorm:"foreignKey:PaymentMethodID"`
}

type BillingHistoryEntity struct {
	
	ID   uint              `gorm:"primaryKey;autoIncrement"`
	UserID      uint
	InvoiceID   uint
	PaymentDate time.Time
	Amount      float64           `gorm:"type:decimal(10,2)"`
	User        UserEntity        `gorm:"foreignKey:UserID;constraint:OnUpdate:RESTRICT"`
	Invoice     InvoiceEntity     `gorm:"foreignKey:InvoiceID;constraint:OnUpdate:RESTRICT"`
}

type ProfileEntity struct {
	ID      uint              `gorm:"primaryKey;autoIncrement"`
	UserID         uint
	FullName       string            `gorm:"type:varchar(255)"`
	Bio            string            `gorm:"type:text"`
	ProfilePicture string            `gorm:"type:varchar(255)"`
	DateOfBirth    time.Time         `gorm:"type:date"`
	Location       string            `gorm:"type:varchar(255)"`
	User           UserEntity        `gorm:"foreignKey:UserID;constraint:OnUpdate:RESTRICT"`
}

type TransactionEntity struct {
	ID   uint               `gorm:"primaryKey;autoIncrement"`
	InvoiceID       uint
	Amount          float64            `gorm:"type:decimal(10,2)"`
	TransactionDate time.Time          `gorm:"default:current_timestamp"`
	PaymentMethodID uint
	Status          string             `gorm:"type:varchar(50)"`
	Invoice         InvoiceEntity      `gorm:"foreignKey:InvoiceID;constraint:OnUpdate:RESTRICT"`
	PaymentMethod   PaymentMethodEntity `gorm:"foreignKey:PaymentMethodID"`
}

type PermissionEntity struct {
	ID         uint                    `gorm:"primaryKey;autoIncrement"`
	Name                 string                  `gorm:"type:varchar(255)"`
	Description          string                  `gorm:"type:text"`
	ModeratorPermissions []ModeratorPermissionEntity `gorm:"foreignKey:PermissionID"`
}

type ModeratorPermissionEntity struct {
	ID uint                 `gorm:"primaryKey;autoIncrement"`
	UserID                uint
	PermissionID          uint
	User                  UserEntity            `gorm:"foreignKey:UserID"`
	Permission            PermissionEntity      `gorm:"foreignKey:PermissionID"`
}


type ApiKeyEntity struct {
	ID       uint          `gorm:"primaryKey;autoIncrement"`
	UserID uint
	ApiKey         string        `gorm:"type:varchar(255);unique"`
	CreationDate   time.Time    `gorm:"default:current_timestamp"`
	IsActive       bool         `gorm:"default:true"`
	User 		 UserEntity `gorm:"foreignKey:UserID"`

}