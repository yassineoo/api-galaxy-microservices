package models

import (
	"time"

	"gorm.io/gorm"
)

// CategoryEntity represents the Categories table
type CategoryEntity struct {
	gorm.Model
//	CategoryID   int             `gorm:"primaryKey;autoIncrement"`
	CategoryName string          `gorm:"size:255;not null"`
	Description  string
	Apis         []ApiEntity     `gorm:"foreignKey:ID"`
}

// ApiEntity represents the Apis table
type ApiEntity struct {
	gorm.Model
	//ApiID        int              `gorm:"primaryKey;autoIncrement"`
	ProviderID   int              `gorm:"not null"`
	Name         string           `gorm:"size:255;not null"`
	ImagePath    string
	Description  string
	CategoryID   int
	DateCreated  time.Time        `gorm:"default:CURRENT_TIMESTAMP"`
	LastUpdated  time.Time
	IsActive     bool             `gorm:"default:true"`
	ApiVersions    []ApiVersionEntity   `gorm:"foreignKey:ApiID"`
    ApiRatings     []ApiRatingEntity    `gorm:"foreignKey:ApiID"`
    Subscriptions  []SubscriptionEntity `gorm:"foreignKey:ID"`
}

// ApiVersionEntity represents the ApiVersions table
type ApiVersionEntity struct {
	gorm.Model
//	VersionID     int            `gorm:"primaryKey;autoIncrement"`
	ApiID         int            `gorm:"not null"`
	VersionNumber string         `gorm:"size:255;not null"`
	ReleaseDate   time.Time
	WhatsNew      string
}

// ApiRatingEntity represents the ApiRatings table
type ApiRatingEntity struct {
	gorm.Model
//	RatingID   int              `gorm:"primaryKey;autoIncrement"`
	ApiID      int              `gorm:"not null"`
	UserID     int              `gorm:"not null"`
	Rating     int              `gorm:"not null"`
	Comment    string
	DateRated  time.Time        `gorm:"default:CURRENT_TIMESTAMP"`
}

// PlanEntity represents the Plans table
type PlanEntity struct {
	gorm.Model
//	PlanID      int               `gorm:"primaryKey;autoIncrement"`
	PlanName    string            `gorm:"size:255;not null"`
	Description string
	Price       float64           `gorm:"type:decimal(10,2)"`
	Features    string            `gorm:"type:json"`
	Subscriptions []SubscriptionEntity   `gorm:"foreignKey:ID"`
}

// SubscriptionEntity represents the Subscriptions table
type SubscriptionEntity struct {
	gorm.Model
//	SubscriptionID int            `gorm:"primaryKey;autoIncrement"`
	UserID         int            `gorm:"not null"`
	ApiID          int            `gorm:"not null"`
	PlanID         int            `gorm:"not null"`
	StartDate      time.Time
	EndDate        time.Time
	Status         string         `gorm:"size:50"`
	ApiKeys        []ApiKeyEntity       `gorm:"foreignKey:ID"`
    UsageLogs      []UsageLogEntity     `gorm:"foreignKey:ID"`
}

// ApiKeyEntity represents the ApiKeys table
type ApiKeyEntity struct {
	gorm.Model
	//ApiKeyID       int            `gorm:"primaryKey;autoIncrement"`
	SubscriptionID int            `gorm:"not null"`
	ApiKey         string         `gorm:"size:255;unique;not null"`
	CreationDate   time.Time      `gorm:"default:CURRENT_TIMESTAMP"`
	IsActive       bool           `gorm:"default:true"`
}

// UsageLogEntity represents the UsageLogs table
type UsageLogEntity struct {
	gorm.Model
	//LogID          int            `gorm:"primaryKey;autoIncrement"`
	SubscriptionID int            `gorm:"not null"`
	Timestamp      time.Time      `gorm:"default:CURRENT_TIMESTAMP"`
	Endpoint       string
	DataVolume     int
	ResponseTime   int
}
