package models

import (
	"local_packages/typesglobale"
	"time"
)

// CategoryEntity represents the Categories table
type CategoryEntity struct {
	ID           int          `gorm:"primaryKey;autoIncrement"`
	CategoryName string       `gorm:"size:255;not null"`
	Description  string
	Apis         []ApiEntity  `gorm:"foreignKey:CategoryID;onDelete:CASCADE"`
}

// ApiCollectionEntity represents the ApiCollectionEntities table
type ApiCollectionEntity struct {
	ID          int           `gorm:"primaryKey;autoIncrement"`
	Name        string        `gorm:"size:255;not null"`
	Description string
	ImagePath   string
	Apis        []ApiEntity   `gorm:"many2many:api_collections_apis;"`
}

// UserEntity represents the Users table
type UserEntity struct {
	ID            int                 `gorm:"primaryKey;autoIncrement"`
	Username      string              `gorm:"size:255;not null"`
	Email         string              `gorm:"size:255;unique;not null"`
	PasswordHash  string              `gorm:"size:60"`
	DateCreated   time.Time           `gorm:"default:CURRENT_TIMESTAMP"`
	LastLogin     time.Time


	IsActive      bool                `gorm:"default:true"`
	IsTwoFactor   bool                `gorm:"default:false"`
	Role          string              `gorm:"size:50"`
	PhoneNumber   string              `gorm:"size:20;unique"`
	Verified      bool                `gorm:"default:false"`
	Image         string              `gorm:"size:255"`
	StripeCustomerId         string              `gorm:"size:255"`
	Apis          []ApiEntity         `gorm:"foreignKey:ProviderID"`
	Likes         []LikeEntity        `gorm:"foreignKey:UserID"`
	ApiReports    []ApiReportEntity   `gorm:"foreignKey:UserID"`
	ReviewReports []ReviewReportsEntity `gorm:"foreignKey:UserID"`

	Settings          []SettingsEntity         `gorm:"foreignKey:AdminID"`
	Notifications    []NotificationEntity `gorm:"foreignKey:RecipientID"`

}

// ApiEntity represents the Apis table
type ApiEntity struct {
	ID                  int                   `gorm:"primaryKey;autoIncrement"`
	ProviderID          int                   `gorm:"not null"`
	Name                string                `gorm:"size:255;not null"`
	ImagePath           string
	Description         string
	Keywords            string
	Visibility          bool                  `gorm:"default:false"`
	Rating              float64               `gorm:"default:0"`
	ApiUrl              string
	CategoryID          int                   `gorm:"null"`
	Collections         []ApiCollectionEntity `gorm:"many2many:api_collections_apis;"`
	Status              typesglobale.ApiStatus `gorm:"type:varchar(20);default:'active'"`
	DateCreated         time.Time             `gorm:"default:CURRENT_TIMESTAMP"`
	LastUpdated         time.Time
	DateDeleted         time.Time
	ApiVersions         []ApiVersionEntity    `gorm:"foreignKey:ApiID;onDelete:CASCADE"`
	ApiReviews          []ApiReviewEntity     `gorm:"foreignKey:ApiID;onDelete:CASCADE"`
	Plans               []PlanEntity          `gorm:"foreignKey:ApiID;onDelete:CASCADE"`
	ObjectPlan          []ObjectPlanEntity    `gorm:"foreignKey:ApiID;onDelete:CASCADE"`
	Groups              []EndpointsGroupEntity `gorm:"foreignKey:ApiID;onDelete:CASCADE"`
	ApiDocs             ApiDocsEntity         `gorm:"foreignKey:ApiID;onDelete:CASCADE"`
	HealthCheck         HealthCheckEntity     `gorm:"foreignKey:ApiID;onDelete:CASCADE"`
	Category            CategoryEntity        `gorm:"foreignKey:CategoryID"`
	User                UserEntity            `gorm:"foreignKey:ProviderID"`
	Likes               []LikeEntity          `gorm:"foreignKey:ApiID"`
	ApiReports          []ApiReportEntity     `gorm:"foreignKey:ApiID"`



}

// LikeEntity represents the LikeEntities table
type LikeEntity struct {
	ID      int       `gorm:"primaryKey;autoIncrement"`
	UserID  int       `gorm:"null"`
	ApiID   int       `gorm:"null"`
	Api     ApiEntity `gorm:"foreignKey:ApiID;onDelete:CASCADE"`
	User    UserEntity `gorm:"foreignKey:UserID;onDelete:CASCADE"`
}


type SettingsEntity struct {
    ID                 int        `gorm:"primaryKey;autoIncrement"`
	AdminID        int                   `gorm:"not null"`
    EarningPercentage  *float32   `gorm:"type:real"`                   // Corresponds to `Float? @db.Real`
    TermsAndConditions  *string    `gorm:"type:text"`                   // Corresponds to `String?`
    PrivacyAndPolicy   *string    `gorm:"type:text"`                   // Corresponds to `String?`
    UpdatedAt          time.Time   `gorm:"default:CURRENT_TIMESTAMP"` // Corresponds to `DateTime? @db.Timestamptz(6) @default(now())`
	User                UserEntity            `gorm:"foreignKey:AdminID"`
}

// ApiDocsEntity represents the ApiDocsEntities table
type ApiDocsEntity struct {
	ID           int          `gorm:"primaryKey;autoIncrement"`
	ApiID        int          `gorm:"not null"`
	Content      string       `gorm:"type:text"`
	LastUpdated  time.Time    `gorm:"default:CURRENT_TIMESTAMP"`
}

// HealthCheckEntity represents the HealthChecks table
type HealthCheckEntity struct {
	ID                  int                          `gorm:"primaryKey;autoIncrement"`
	ApiID               int                          `gorm:"unique;not null"`
	LastStatus          string                       `gorm:"type:varchar(20);default:'pending'"`
	LastCheckedAt       time.Time
	AlertsEnabled       bool
	EndpointID          int                          `gorm:"not null"`
	Endpoint            EndpointsEntity              `gorm:"foreignKey:EndpointID"`
	Email               string
	Results             []HealthCheckResultEntity    `gorm:"foreignKey:HealthCheckID;onDelete:CASCADE"`
}

// HealthCheckResultEntity represents the HealthCheckResults table
type HealthCheckResultEntity struct {
	ID              int              `gorm:"primaryKey;autoIncrement"`
	HealthCheckID   int              `gorm:"not null"`
	Status          string           `gorm:"type:varchar(20);not null"`
	ResponseTime    int
	StatusMessage   string
	CheckedAt       time.Time        `gorm:"default:CURRENT_TIMESTAMP"`
	HealthCheck     HealthCheckEntity `gorm:"foreignKey:HealthCheckID"`
}

// EndpointsGroupEntity represents the EndpointsGroupEntities table
type EndpointsGroupEntity struct {
	ID              int                 `gorm:"primaryKey;autoIncrement"`
	ApiID           int                 `gorm:"not null"`
	Group           string
	Description     string
	Endpoints       []EndpointsEntity   `gorm:"foreignKey:GroupID"`
}

// EndpointsEntity represents the EndpointsEntities table
type EndpointsEntity struct {
	ID              int                     `gorm:"primaryKey;autoIncrement"`
	GroupID         int                     `gorm:"not null"`
	Methode         string                  `gorm:"size:255;not null"`
	Name            string                  `gorm:"size:255;null"`
	Url             string                  `gorm:"size:255;not null"`
	Description     string
	Group           EndpointsGroupEntity    `gorm:"foreignKey:GroupID"`
	Parameters      []EndpointsParameterEntity `gorm:"foreignKey:EndpointID;onDelete:CASCADE"`
	BodyParam       BodyParamEntity         `gorm:"foreignKey:EndpointID;onDelete:CASCADE"`
	Logs            []UsageLogEntity        `gorm:"foreignKey:EndpointID;onDelete:CASCADE"`
	HealthCheck     []HealthCheckEntity     `gorm:"foreignKey:EndpointID;onDelete:CASCADE"`
}

// EndpointsParameterEntity represents the EndpointsParameterEntities table
type EndpointsParameterEntity struct {
	ID              int              `gorm:"primaryKey;autoIncrement"`
	EndpointID      int              `gorm:"null"`
	Key             string           `gorm:"size:255;not null"`
	ValueType       string           `gorm:"size:255"`
	ParameterType   string           `gorm:"size:255"`
	ExampleValue    string           `gorm:"size:255"`
	Required        bool             `gorm:"default:false"`
}

// BodyParamEntity represents the BodyParamEntities table
type BodyParamEntity struct {
	ID              int              `gorm:"primaryKey;autoIncrement"`
	EndpointID      int              `gorm:"not null"`
	ContentType     string           `gorm:"size:255;not null"`
	TextBody        string           `gorm:"type:text"`
}

// ApiVersionEntity represents the ApiVersions table
type ApiVersionEntity struct {
	ID             int           `gorm:"primaryKey;autoIncrement"`
	ApiID          int           `gorm:"not null"`
	VersionNumber  string        `gorm:"size:255;not null"`
	ReleaseDate    time.Time
	WhatsNew       string
}

// ApiReviewEntity represents the ApiReviewEntities table
type ApiReviewEntity struct {
	ID             int           `gorm:"primaryKey;autoIncrement"`
	ApiID          int           `gorm:"not null"`
	UserID         int           `gorm:"not null"`
	Rating         int           `gorm:"not null"`
	Comment        string
	DateRated      time.Time      `gorm:"default:CURRENT_TIMESTAMP"`
	Api            ApiEntity      `gorm:"foreignKey:ApiID"`
	User           UserEntity     `gorm:"foreignKey:UserID"`
	ReviewReports  []ReviewReportsEntity `gorm:"foreignKey:ReviewID"`
}

// ReviewReportsEntity represents the ReviewReportsEntities table
type ReviewReportsEntity struct {
	ID             int                   `gorm:"primaryKey;autoIncrement"`
	UserID         int                   `gorm:"null"`
	ReviewID       int                   `gorm:"null"`
	Description    string
	Reason         string
	ApiReview      ApiReviewEntity       `gorm:"foreignKey:ReviewID;onDelete:NoAction"`
	User           UserEntity            `gorm:"foreignKey:UserID;onDelete:NoAction"`
}

// ApiReportEntity represents the ApiReportEntities table
type ApiReportEntity struct {
	ID             int             `gorm:"primaryKey;autoIncrement"`
	UserID         int             `gorm:"null"`
	ApiID          int             `gorm:"null"`
	Description    string
	Screenshots    []string         `gorm:"type:text[]"`
	Api            ApiEntity        `gorm:"foreignKey:ApiID;onDelete:NoAction"`
	User           UserEntity       `gorm:"foreignKey:UserID;onDelete:NoAction"`
}

// PlanEntity represents the PlanEntities table
type PlanEntity struct {
	ID             int                   `gorm:"primaryKey;autoIncrement"`
	ApiID          int                   `gorm:"not null"`
	Name           string                `gorm:"size:255;not null"`
	Active         bool
	Visibility     bool
	Type           string
	Rate           int
	RateUnite      string
	RecomndedPlan  bool


	Price          float64               `gorm:"type:decimal(10,2)"`
	StripePriceId string                `gorm:"size:255"`
	Subscriptions  []SubscriptionEntity  `gorm:"foreignKey:PlanID"`
}

// ObjectPlanEntity represents the ObjectPlanEntities table
type ObjectPlanEntity struct {
	ID             int                   `gorm:"primaryKey;autoIncrement"`
	ApiID          int                   `gorm:"not null"`
	Name           string                `gorm:"size:255;not null"`
	Description    string
	Cross          []CrossObjectEntity   `gorm:"foreignKey:ObjectID;onDelete:CASCADE"`
	EndpointList   []EndpointObjectEntity `gorm:"foreignKey:ObjectID"`
	AllEndpoints   bool
}

// CrossObjectEntity represents the CrossObjectEntities table
type CrossObjectEntity struct {
	ID             int                   `gorm:"primaryKey;autoIncrement"`
	ObjectID       int                   `gorm:"not null"`
	LimitFee       int
	LimitType      string
	Price          float64               `gorm:"type:decimal(10,2)"`
	QuotaType      string
	QuotaValue     int
	Add            bool                  `gorm:"default:false"`
	Object         ObjectPlanEntity      `gorm:"foreignKey:ObjectID"`
}

// EndpointObjectEntity represents the EndpointObjectEntities table
type EndpointObjectEntity struct {
	ID             int                   `gorm:"primaryKey;autoIncrement"`
	ObjectID       int                   `gorm:"not null"`
	EndpointsID    int                   `gorm:"not null"`
}

// SubscriptionEntity represents the SubscriptionEntities table
type SubscriptionEntity struct {


	ID             int                   `gorm:"primaryKey;autoIncrement"`
	UserID         int                   `gorm:"not null"`
	PlanID         int                   `gorm:"not null"`
	StartDate      time.Time
	EndDate        time.Time
	UsedCalls      int                   // Number of calls used
	Status         string                `gorm:"size:50"`
	StripeSubId string					 `gorm:"size:255"`
	UsageLogs      []UsageLogEntity      `gorm:"foreignKey:SubscriptionID;onDelete:CASCADE"`
	Plan           PlanEntity            `gorm:"foreignKey:PlanID"`

}

// UsageLogEntity represents the UsageLogEntities table
type UsageLogEntity struct {
	ID             int                   `gorm:"primaryKey;autoIncrement"`
	SubscriptionID int                   `gorm:"not null"`
	Timestamp      time.Time             `gorm:"default:CURRENT_TIMESTAMP"`
	EndpointID     int                   `gorm:"not null"`
	Status         int                   // status code of the response
	ResponseTime   int                   // in ms
	Endpoint       EndpointsEntity       `gorm:"foreignKey:EndpointID"`
}

// InvoiceEntity represents the InvoiceEntities table
type InvoiceEntity struct {


	ID              uint                    `gorm:"primaryKey;autoIncrement"`
	SubscriptionID  uint
	TotalAmount     float64                 `gorm:"type:decimal(10,2)"`
	DateIssued      time.Time               `gorm:"default:current_timestamp"`
	DueDate         time.Time
	Status          string                  `gorm:"type:varchar(50)"`
	StripeInvoiceId string                  `gorm:"type:varchar(255)"`
	BillingHistory  []BillingHistoryEntity  `gorm:"foreignKey:InvoiceID"`
	Subscription    SubscriptionEntity      `gorm:"foreignKey:SubscriptionID;constraint:OnUpdate:RESTRICT"`
	Transactions    []TransactionEntity     `gorm:"foreignKey:InvoiceID"`


}

// PaymentMethodEntity represents the PaymentMethodEntities table
type PaymentMethodEntity struct {
	ID              uint                    `gorm:"primaryKey;autoIncrement"`
	UserID          uint

	Provider        string               `gorm:"type:varchar(255)"`
	AccountDetails  string               `gorm:"type:text"`
	IsDefault       bool                 `gorm:"default:false"`
	StripePaymentMethodID string         `gorm:"size:255"`
	User            UserEntity           `gorm:"foreignKey:UserID;constraint:OnUpdate:RESTRICT"`
	Transactions    []TransactionEntity  `gorm:"foreignKey:PaymentMethodID"`

}

// BillingHistoryEntity represents the BillingHistoryEntities table
type BillingHistoryEntity struct {
	ID              uint                    `gorm:"primaryKey;autoIncrement"`
	UserID          uint
	InvoiceID       uint
	PaymentDate     time.Time
	Amount          float64                 `gorm:"type:decimal(10,2)"`
	User            UserEntity              `gorm:"foreignKey:UserID;constraint:OnUpdate:RESTRICT"`
	Invoice         InvoiceEntity           `gorm:"foreignKey:InvoiceID;constraint:OnUpdate:RESTRICT"`
}

// ProfileEntity represents the ProfileEntities table
type ProfileEntity struct {
	ID              uint                    `gorm:"primaryKey;autoIncrement"`
	UserID          uint
	FullName        string                  `gorm:"type:varchar(255)"`
	Bio             string                  `gorm:"type:text"`
	ProfilePicture  string                  `gorm:"type:varchar(255)"`
	DateOfBirth     time.Time               `gorm:"type:date"`
	Location        string                  `gorm:"type:varchar(255)"`
	User            UserEntity              `gorm:"foreignKey:UserID;constraint:OnUpdate:RESTRICT"`
}

// TransactionEntity represents the TransactionEntities table
type TransactionEntity struct {
	ID              uint                    `gorm:"primaryKey;autoIncrement"`
	InvoiceID       uint
	Amount          float64                 `gorm:"type:decimal(10,2)"`
	TransactionDate time.Time               `gorm:"default:current_timestamp"`
	PaymentMethodID uint
	Status          string                  `gorm:"type:varchar(50)"`
	Invoice         InvoiceEntity           `gorm:"foreignKey:InvoiceID;constraint:OnUpdate:RESTRICT"`
	PaymentMethod   PaymentMethodEntity     `gorm:"foreignKey:PaymentMethodID"`
}

// PermissionEntity represents the PermissionEntities table
type PermissionEntity struct {
	ID              uint                    `gorm:"primaryKey;autoIncrement"`
	Name            string                  `gorm:"type:varchar(255)"`
	Description     string                  `gorm:"type:text"`
	ModeratorPermissions []ModeratorPermissionEntity `gorm:"foreignKey:PermissionID"`
}

// ModeratorPermissionEntity represents the ModeratorPermissionEntities table
type ModeratorPermissionEntity struct {
	ID              uint                    `gorm:"primaryKey;autoIncrement"`
	UserID          uint
	PermissionID    uint
	User            UserEntity              `gorm:"foreignKey:UserID"`
	Permission      PermissionEntity        `gorm:"foreignKey:PermissionID"`
}

// ApiKeyEntity represents the ApiKeyEntities table
type ApiKeyEntity struct {
	ID              uint                    `gorm:"primaryKey;autoIncrement"`
	UserID          uint
	ApiKey          string                  `gorm:"type:varchar(255);unique"`
	CreationDate    time.Time               `gorm:"default:current_timestamp"`
	IsActive        bool                    `gorm:"default:true"`
	User            UserEntity              `gorm:"foreignKey:UserID"`
}


// add notification 
type NotificationEntity struct {
    ID           int            `gorm:"primaryKey;autoIncrement;column:id"`
    RecipientID  *int64         `gorm:"column:recipient_id"`   // Nullable BigInt equivalent
    Title        *string        `gorm:"column:title"`          // Nullable String equivalent
    Message      *string        `gorm:"column:message"`        // Nullable String equivalent
	IsRead      bool                `gorm:"default:true"`
    UserEntity   *UserEntity    `gorm:"foreignKey:RecipientID;constraint:onUpdate:CASCADE,onDelete:CASCADE;references:ID"`
}