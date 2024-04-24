package services

import (
	//"auth/security"
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"local_packages/api/types"
	"local_packages/models"
	"local_packages/typesglobale"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/jackc/pgx/v4/pgxpool"
	"gorm.io/gorm"
)


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
    if err := s.gormDB.Preload("HealthCheck").Preload("ApiDocs").Preload("Category").Where("id = ?", id).First(&api).Error; err != nil {
        return nil, err
    }

    return &api, nil
}

func (s *Service) GetAll(ctx context.Context, page int, limit int , filter int ,search string) (types.ApiResponse, error) {
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
		return types.ApiResponse{}, err
	}

	var apis []models.ApiEntity
        if filter > 0 { 
            if err := s.gormDB.Offset(offset).Limit(limit).Where("category_id = ?", filter).Find(&apis).Error; err != nil {
            return types.ApiResponse{}, err
        }
        } else {
        if err := s.gormDB.Offset(offset).Limit(limit).Find(&apis).Error; err != nil {
            return types.ApiResponse{}, err
        }
        }

  


	totalPages := (int(totalItems) + limit - 1) / limit // Calculate total pages.

	response := types.ApiResponse{
		Apis: apis,
		Meta: types.PaginationMeta{
			TotalItems:   int(totalItems),
			ItemCount:    len(apis),
			ItemsPerPage: limit,
			TotalPages:   totalPages,
			CurrentPage:  page,
		},
	}

	return response, nil
}

func (s *Service) GetUserAPIs(ctx context.Context, userID int) ([]models.ApiEntity, error) {
    // Retrieve the APIs associated with the specified user ID as the provider
    var userApis []models.ApiEntity
    if err := s.gormDB.Where("provider_id = ?", userID).Find(&userApis).Error; err != nil {
        return nil, err
    }

    return userApis, nil
}


func (s *Service) Create(ctx context.Context, item types.ApiDto) (*models.ApiEntity, error) {
	// Implement the logic to create a new item in the database.
	// You can use s.db and s.gormDB to interact with the database.
	// Replace the placeholder logic with your actual database insertion.
	newApi := models.ApiEntity{
		ProviderID:  item.ProviderID,
		Name:        item.Name,
        ApiUrl:      item.ApiUrl,
        Keywords:    item.Keywords,
		ImagePath:   item.ImagePath,
		Description: item.Description,
		CategoryID:  item.CategoryID,
        Visibility:  item.Visibility,
		// Set other fields as needed
	}

	if err := s.gormDB.Create(&newApi).Error; err != nil {
		return nil, err
	}


    // Create associated ApiDocsEntity with empty content
	newApiDocs := models.ApiDocsEntity{
		ApiID:   newApi.ID,
		Content: newApi.Name + " Docs", // You can set the default content here
		// Set other fields as needed
	}

	if err := s.gormDB.Create(&newApiDocs).Error; err != nil {
		return nil, err
	}


    newGroup := models.EndpointsGroupEntity{
        ID: newApi.ID,
        ApiID: newApi.ID,
        Group: "Default",
    }
    if err := s.gormDB.Create(&newGroup).Error; err != nil {
		return nil, err
	}
	return &newApi, nil
}
func (s *Service) Update(ctx context.Context, id int, item types.ApiDto) (*models.ApiEntity, error) {
	// Implement the logic to edit an existing item in the database.
	// You can use s.db and s.gormDB to interact with the database.
	// Replace the placeholder logic with your actual database update.

	// Preload HealthCheck entity when fetching the API to update
	var api models.ApiEntity
	if err := s.gormDB.Preload("HealthCheck").Where("id = ?", id).First(&api).Error; err != nil {
		return nil, err
	}

	// Update fields based on item
	if item.Name != "" {
		api.Name = item.Name
	}

	if item.Description != "" {
		api.Description = item.Description
	}

	if item.ImagePath != "" {
		api.ImagePath = item.ImagePath
	}

	if item.Status == "active" {
		api.Status = typesglobale.StatusActive
	} else {
		api.Status = typesglobale.StatusInactive
	}

	api.Visibility = item.Visibility

	// Check if HealthCheckEndpointId is provided in the item
	if item.HealthCheckEndpointId != 0 {
		// Check if HealthCheck already exists for this API
		if api.HealthCheck.ID != 0 {

			// Update existing HealthCheck
			api.HealthCheck.EndpointID = item.HealthCheckEndpointId
			api.HealthCheck.Email = item.EmailNotifcation
			api.HealthCheck.AlertsEnabled = item.EmailNotifcation != ""
			// Update other fields of HealthCheck as needed
			if err := s.gormDB.Save(&api.HealthCheck).Error; err != nil {
				return nil, err
			}
		} else {
			// Create new HealthCheck
			healthCheck := models.HealthCheckEntity{
                ApiID:         id,
				EndpointID:    item.HealthCheckEndpointId,
				Email:         item.EmailNotifcation,
				AlertsEnabled: item.EmailNotifcation != "",
				// Set other fields of HealthCheck as needed
			}
			if err := s.gormDB.Create(&healthCheck).Error; err != nil {
				return nil, err
			}
			// Assign the newly created HealthCheck to the API
			api.HealthCheck = healthCheck
		}
	}

	// Save the updated API entity to the database
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
		   return fmt.Errorf("item with id %d not found", id)
	   }
	   return err
   }

   // Delete the item from the database
   if err := s.gormDB.Delete(&apiEntity,id).Error; err != nil {
	   return err
   }
   return nil
}




func (s *Service) Subscribe(ctx context.Context, apiID int) ([]models.ApiCollectionEntity, error) {
    var collections []models.ApiCollectionEntity

    if err := s.gormDB.Where("id = ?", apiID).Find(&collections).Error; err != nil {
        return nil, err
    }

    return collections, nil
}





/*
func (s *Service) SendRequest(ctx context.Context, data types.RequestData) (*http.Response, error) {
    client := &http.Client{}

    if err := s.checkSubscriptionAndQuota(ctx, data.EndpointID ,123, 24); err != nil {
        return nil, err // Return appropriate error for plan/quota issues
    }


    req, err := http.NewRequest(data.Method, data.URL, bytes.NewBufferString(""))
    if err != nil {
        return nil, err
    }

    // Set request headers
    for key, value := range data.Headers {
        req.Header.Set(key, value)
    }

    // Set query parameters
    q := req.URL.Query()
    for key, value := range data.Params {
        q.Add(key, value)
    }
    req.URL.RawQuery = q.Encode()

    // Set request body if data is provided
    if len(data.Data) > 0 {
        req.Header.Set("Content-Type", "application/json")
        jsonData, err := json.Marshal(data.Data)
        if err != nil {
            return nil, err
        }
        req.Body = ioutil.NopCloser(bytes.NewBuffer(jsonData))
    }

    // Send the request and get the response
    startTime := time.Now() // Start time measurement

    resp, err := client.Do(req)
    if err != nil {
        return nil, err
    }

      // Calculate response time based on content length and potential header information
  endTime := time.Now()
  contentLength, err := strconv.Atoi(resp.Header.Get("Content-Length"))
  if err != nil {
    // Handle error or use another method for response time estimation
    contentLength = 0
  }
  responseTime := endTime.Sub(startTime) - time.Duration(contentLength) * time.Nanosecond / 1024 / 1024

  // Create log entity with all info after receiving response
  newLog := models.UsageLogEntity {
    // Set fields from request data: EndpointID, SubscriptionID (if applicable)
    EndpointID:  data.EndpointID,
    SubscriptionID: 2,
    Timestamp:    startTime,
    Status:      resp.StatusCode,
    ResponseTime: int(responseTime.Milliseconds()),
  }

  go func() {

    log.Println("newLog ============================= ")
    if err := s.gormDB.Create(&newLog).Error; err != nil {
        return ;
    }
  }()   
    

    return resp, nil
}
*/

func (s *Service) SendRequest(ctx context.Context, data types.RequestData) (*http.Response, error) {
    client := &http.Client{}
/*
    if err := s.checkSubscriptionAndQuota(ctx, data.EndpointID ,123, data.ApiID); err != nil {
        return nil, err // Return appropriate error for plan/quota issues
    }
    */
    var api models.ApiEntity
    if err := s.gormDB.Where("id = ?", data.ApiID).First(&api).Error; err != nil {
        return nil, err
    }




 
    log.Println("api.ApiUrl ============================= " ,api.ApiUrl+data.URL )
    log.Println("api.ApiUrl ============================= " ,api.ApiUrl+data.URL )


       
    req, err := http.NewRequest(data.Method, api.ApiUrl+data.URL, bytes.NewBufferString(""))
    if err != nil {
        return nil, err
    }
    // Set request headers
    for key, value := range data.Headers {
        req.Header.Set(key, value)
    }

    // Set query parameters
    q := req.URL.Query()
    for key, value := range data.Params {
        q.Add(key, value)
    }
    req.URL.RawQuery = q.Encode()

    // Set request body if data is provided
    if len(data.Data) > 0 {
        req.Header.Set("Content-Type", "application/json")
        jsonData, err := json.Marshal(data.Data)
        if err != nil {
            return nil, err
        }
        req.Body = ioutil.NopCloser(bytes.NewBuffer(jsonData))
    }

    // Send the request and get the response
    startTime := time.Now() // Start time measurement

    resp, err := client.Do(req)
    if err != nil {
        return nil, err
    }

      // Calculate response time based on content length and potential header information
  endTime := time.Now()
  contentLength, err := strconv.Atoi(resp.Header.Get("Content-Length"))
  if err != nil {
    // Handle error or use another method for response time estimation
    contentLength = 0
  }
  responseTime := endTime.Sub(startTime) - time.Duration(contentLength) * time.Nanosecond / 1024 / 1024

  // Create log entity with all info after receiving response
  newLog := models.UsageLogEntity {
    // Set fields from request data: EndpointID, SubscriptionID (if applicable)
    EndpointID:  data.EndpointID,
    SubscriptionID: 2,
    Timestamp:    startTime,
    Status:      resp.StatusCode,
    ResponseTime: int(responseTime.Milliseconds()),
  }

  go func() {

    log.Println("newLog ============================= ")
    if err := s.gormDB.Create(&newLog).Error; err != nil {
        return ;
    }
  }()   
    

    return resp, nil
}



/*
func (s *Service) checkSubscriptionAndQuota(ctx context.Context, endpointID int , userID int , ApiID int ) error {


    // Get active subscription for the user
    var subscription models.SubscriptionEntity
    if err := s.gormDB.Preload("Plan"). Where("user_id = ? AND status = ?", userID, "active").First(&subscription).Error; err != nil {
        if errors.Is(err, gorm.ErrRecordNotFound) {
            return errors.New("user does not have an active subscription")
        }
        return fmt.Errorf("error retrieving user subscription: %w", err)
    }



    // Retrieve chosen object and its cross objects
    var objectPlan models.ObjectPlanEntity
    if err := s.gormDB.Preload("Cross").Where("api_id = ?", 24).First(&objectPlan).Error; err != nil {
        if errors.Is(err, gorm.ErrRecordNotFound) {
            return errors.New("object not found")
        }
        return fmt.Errorf("error retrieving object: %w", err)

        
    }
    var crossObject models.CrossObjectEntity; 
    if (objectPlan.Cross != nil) {
        if (subscription.Plan.Name == "Basic") {
            crossObject = objectPlan.Cross[0] 
        }
        if (subscription.Plan.Name == "Pro") {
            crossObject = objectPlan.Cross[1]
        }
        if (subscription.Plan.Name == "Ultra") {
            crossObject = objectPlan.Cross[2]
        }
        if (subscription.Plan.Name == "Mega") {
            crossObject = objectPlan.Cross[3]
        }
    }

    log.Println("subscription.UsedCalls ============================= ")

    log.Println("subscription.UsedCalls", subscription)
    log.Println("subscription.UsedCalls ============================= ")
    


    // Increase used calls based on plan type
    if subscription.Plan.Type == "Usage" {
        subscription.UsedCalls++
    } else if subscription.Plan.Type == "Monthely" {
        if subscription.UsedCalls >= crossObject.QuotaValue {
            if crossObject.LimitType == "hard" {
                return errors.New("monthly quota exceeded")
            } else if crossObject.LimitType == "soft" {
                subscription.UsedCalls++;
            }
        }
        subscription.UsedCalls++
    } else {
        return errors.New("unsupported plan type")
    }
   


    // Update subscription usage in the database
    if err := s.gormDB.Save(&subscription).Error; err != nil {
        return fmt.Errorf("error updating subscription usage: %w", err)
    }

    return nil
}
*/



func (s *Service) HealthCheackSendRequest(ctx context.Context, apiID int, endpointID int) (int, error) {
    // Fetch API entity from the database
    var api models.ApiEntity
    if err := s.gormDB.Where("id = ?", apiID).First(&api).Error; err != nil {
        return 0, err
    }

    // Fetch endpoint entity from the database
    var endpoint models.EndpointsEntity
    if err := s.gormDB.Where("id = ?", endpointID).First(&endpoint).Error; err != nil {
        return 0, err
    }

    // Construct the full endpoint URL
    endpointURL := api.ApiUrl +"/"+ endpoint.Url

    // Create a new HTTP request with the specified method
    req, err := http.NewRequest(endpoint.Methode, endpointURL, nil)
    if err != nil {
        return 0, err
    }

    // Set request headers
    for _, param := range endpoint.Parameters {
        if param.ParameterType == "Header" {
            req.Header.Set(param.Key, param.ExampleValue)
        }
    }

    // Set query parameters
    q := req.URL.Query()
    for _, param := range endpoint.Parameters {
        if param.ParameterType == "Query" {
            q.Add(param.Key, param.ExampleValue)
        }
    }
    req.URL.RawQuery = q.Encode()

    // Set request body
    if endpoint.BodyParam.ContentType != "" {
        req.Header.Set("Content-Type", endpoint.BodyParam.ContentType)
        if endpoint.BodyParam.ContentType == "application/json" {
            req.Body = ioutil.NopCloser(bytes.NewBufferString(endpoint.BodyParam.TextBody))
        }
    }

    // Send the request and get the response
    client := &http.Client{}
    resp, err := client.Do(req)
    if err != nil {
        return 0, err
    }
    defer resp.Body.Close()

    // Return the status code
    return resp.StatusCode, nil
}


























func (s *Service) CronJobHealthCheck()  error {
	// Fetch all HealthCheckEntities from the database
	var healthChecks []models.HealthCheckEntity
	if err := s.gormDB.Find(&healthChecks).Error; err != nil {
		log.Printf("Error fetching health checks: %v\n", err)
		return err
	}

	// Iterate through each HealthCheckEntity and send requests
	for _, healthCheck := range healthChecks {
		statusCode,responseTime, err := s.HealthCheackJobSendRequest( healthCheck.ApiID, healthCheck.EndpointID)
		if err != nil {
			log.Printf("Error sending request for HealthCheckID %d: %v\n", healthCheck.ID, err)
			continue
		}

		// Save the response status code and other information in HealthCheckResultEntity
		result := models.HealthCheckResultEntity{
			HealthCheckID: healthCheck.ID,
			Status:        getStatusFromCode(statusCode), // Implement your status code to status string conversion logic
			ResponseTime:  responseTime, // Update with actual response time if needed
			StatusMessage: "", // Update with relevant message if needed
			CheckedAt:     time.Now(),
		}

		if err := s.gormDB.Create(&result).Error; err != nil {
			log.Printf("Error saving result for HealthCheckID %d: %v\n", healthCheck.ID, err)
            return err
		}
	}

    return nil
}




func (s *Service) HealthCheackJobSendRequest( apiID int, endpointID int) (int,int, error) {
    // Fetch API entity from the database
    var api models.ApiEntity
    if err := s.gormDB.Where("id = ?", apiID).First(&api).Error; err != nil {
        return 0,0, err
    }

    // Fetch endpoint entity from the database
    var endpoint models.EndpointsEntity
    if err := s.gormDB.Where("id = ?", endpointID).First(&endpoint).Error; err != nil {
        return 0,0, err
    }

    // Construct the full endpoint URL
    endpointURL := api.ApiUrl +"/"+ endpoint.Url

    // Create a new HTTP request with the specified method
    req, err := http.NewRequest(endpoint.Methode, endpointURL, nil)
    if err != nil {
        return 0,0, err
    }

    // Set request headers
    for _, param := range endpoint.Parameters {
        if param.ParameterType == "Header" {
            req.Header.Set(param.Key, param.ExampleValue)
        }
    }

    // Set query parameters
    q := req.URL.Query()
    for _, param := range endpoint.Parameters {
        if param.ParameterType == "Query" {
            q.Add(param.Key, param.ExampleValue)
        }
    }
    req.URL.RawQuery = q.Encode()

    // Set request body
    if endpoint.BodyParam.ContentType != "" {
        req.Header.Set("Content-Type", endpoint.BodyParam.ContentType)
        if endpoint.BodyParam.ContentType == "application/json" {
            req.Body = ioutil.NopCloser(bytes.NewBufferString(endpoint.BodyParam.TextBody))
        }
    }

     // Send the request and get the response
     client := &http.Client{}
     startTime := time.Now()
     resp, err := client.Do(req)
     if err != nil {
         return 0,0, err
     }
     defer resp.Body.Close()
 
     // Calculate the actual response time
     endTime := time.Now()
     responseTime := int(endTime.Sub(startTime).Milliseconds())
 
     // Return the status code and response time
     return resp.StatusCode, responseTime ,nil
}

// getStatusFromCode is a placeholder function, replace it with your actual implementation
func getStatusFromCode(code int) string {
	// Implement logic to map status code to status string
	if code >= 200 && code < 300 {
        return "success"
    }
    return "failed"
}

