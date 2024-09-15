package handlers

import (
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"strconv"
	"strings"

	"local_packages/api/services"
	"local_packages/api/types"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

type ApiHandler struct {
	service *services.Service
}

func NewApiHandler(s *services.Service) *ApiHandler {
	return &ApiHandler{service: s}
}

func (h *ApiHandler) HandleRequest(c *gin.Context) {
	result := "h.myservice.Hello()"
	c.JSON(200, gin.H{"message": result})
}

// @Summary Get all APIs
// @Description Retrieves a paginated list of APIs
// @Produce json
// @Tags Apis Operations
// @Param page query int false "Page number"
// @Param limit query int false "Results per page"
// @Success 200 {object} map[string]interface{}
// @Failure 400 {object} map[string]string
// @Router /apis [get]
func (h *ApiHandler) GetAllApis(c *gin.Context) {
	// Default values for pagination
	defaultPage := 1
	defaultLimit := 10

	// Extract query parameters
	page, err := strconv.Atoi(c.DefaultQuery("page", strconv.Itoa(defaultPage)))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid page parameter"})
		return
	}

	limit, err := strconv.Atoi(c.DefaultQuery("limit", strconv.Itoa(defaultLimit)))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid limit parameter"})
		return
	}
	filter, err := strconv.Atoi(c.DefaultQuery("filter", strconv.Itoa(defaultLimit)))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid filter parameter"})
		return
	}
	search := c.Query("search")

	// Call the GetAll service method
	data, err := h.service.GetAll(c, page, limit, filter, search)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error fetching data"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": data})
}

// @Summary Create API
// @Description Creates a new API from the provided data
// @Accept json
// @Produce json
// @Tags Apis Operations
// @Param api body types.ApiDto true "API Data"
// @Success 201 {object} map[string]interface{}
// @Failure 400 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /apis [post]
func (h *ApiHandler) CreateApi(c *gin.Context) {
	var api types.ApiDto // Replace with your actual model
	if err := c.ShouldBindJSON(&api); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	result, err := h.service.Create(c, api)
	if err != nil {
		// Log the actual error
		log.Println("Error creating API:", err)

		// Return a customized error message to the client
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error creating API"})
		return
	}

	c.JSON(http.StatusCreated, result)
}

// @Summary Get API by ID
// @Description Retrieve API details based on the provided ID.
// @ID get-api-by-id
// @Produce json
// @Tags Apis Operations
// @Param id path int true "API ID"
// @Success 200 {object} map[string]interface{}
// @Failure 400 {object} error
// @Router /apis/{id} [get]
func (h *ApiHandler) GetApi(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		// Log the actual error
		log.Println("Error creating API:", err)

		// Return a customized error message to the client
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}
	api, err := h.service.GetOne(c, id)
	if err != nil {
		// Log the actual error
		log.Println("Error creating API:", err)

		// Return a customized error message to the client
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error fetching API"})
		return
	}

	c.JSON(http.StatusOK, api)
}

// @Summary Get APIs by User ID (Provider ID)
// @Description Retrieves APIs associated with the specified user ID (Provider ID)
// @Produce json
// @Tags Apis Operations
// @Param user_id path int true "User ID (Provider ID)"
// @Success 200 {object} map[string]interface{}
// @Failure 400 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /user-apis/{user_id} [get]
func (h *ApiHandler) GetUserAPIs(c *gin.Context) {
	userID, err := strconv.Atoi(c.Param("user_id"))
	if err != nil {
		// Log the actual error
		log.Println("Error retrieving user APIs:", err)

		// Return a customized error message to the client
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid User ID"})
		return
	}

	// Call the GetUserAPIs service method
	userAPIs, err := h.service.GetUserAPIs(c, userID)
	if err != nil {
		// Log the actual error
		log.Println("Error fetching user APIs:", err)

		// Return a customized error message to the client
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error fetching user APIs"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": userAPIs})
}

func (h *ApiHandler) GetSearchApis(c *gin.Context) {
      // Extract the search query parameter from the URL query string.
	  search := c.Query("search")
	  log.Println("search ==============",search)
	  apis, err := h.service.SearchByName(c, search)

	  // Call the SearchByName method to search for APIs.
	  if err != nil {
		  // Return a customized error message to the client
		  c.JSON(http.StatusInternalServerError, gin.H{"error": "Error fetching user Searched APIs"})
		  return
	  }

	// Call the SearchByName method to search for APIs.
	if err != nil {
		// Return a customized error message to the client
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error fetching user Searched APIs"})
		return
	}

	fmt.Println(gin.H{"data": apis})

	c.JSON(http.StatusOK, gin.H{"data": apis})
}

// @Summary Update API by ID
// @Description Updates the API with the given ID
// @Accept json
// @Produce json
// @Tags Apis Operations
// @Param id path int true "API ID"
// @Param api body types.UpdateApiDto true "API Data"
// @Success 200 {object} map[string]interface{}
// @Failure 400 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /apis/{id} [put]
func (h *ApiHandler) UpdateApi(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		// Log the actual error
		log.Println("Error creating API:", err)

		// Return a customized error message to the client
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	var api types.ApiDto // Replace with your actual model
	if err := c.ShouldBindJSON(&api); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	log.Println("api")
	log.Println(api)

	updatedApi, err := h.service.Update(c, id, api)
	if err != nil {
		// Log the actual error
		log.Println("Error creating API:", err)

		// Return a customized error message to the client
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error updating API"})
		return
	}

	c.JSON(http.StatusOK, updatedApi)
}

// @Summary Delete API by ID
// @Description Deletes the API with the provided ID
// @Produce json
// @Tags Apis Operations
// @Param id path int true "API ID"
// @Success 200 {object} map[string]string
// @Failure 400 {object} map[string]string
// @Failure 404 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /apis/{id} [delete]
func (h *ApiHandler) DeleteApi(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		// Log the actual error
		log.Println("Error creating API:", err)

		// Return a customized error message to the client
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	err = h.service.Delete(c, id)
	if err != nil {
		// Log the actual error
		log.Println("Error creating API:", err)

		// Return a customized error message to the client
		// Check if the error message indicates "not found"
		if strings.Contains(err.Error(), "not found") {
			c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		} else {
			log.Println("Error creating API:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error deleting API"})
		}
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "API deleted successfully"})
}

func (h *ApiHandler) HandleSendRequest(c *gin.Context) {
	var requestData types.RequestData

	if err := c.BindJSON(&requestData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	response, err := h.service.SendRequest(c, requestData)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	defer response.Body.Close()
	body, err := ioutil.ReadAll(response.Body)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Get the request header from the context
	requestHeader := c.Request.Header

	c.JSON(http.StatusOK, gin.H{
		"RequestHeader": requestHeader,
		"statusCode":    response.StatusCode,
		"RequestBody":   string(body),
	})
}

func (h *ApiHandler) HandleSendRequest2(c *gin.Context) {
	// Extract API ID and Endpoint URL from the request path
	path := c.Param("path")
	apiID, _ := strconv.Atoi(c.Param("api-id"))
	//endpointURL := c.Param("endpointsUrl")

	// Extract HTTP method from the incoming request
	method := c.Request.Method

	// Extract headers from the incoming request
	headers := make(map[string]string)
	for k, v := range c.Request.Header {
		headers[k] = strings.Join(v, ", ")
	}

	// Access a specific header value
	jwtToken := headers["Galaxy-Api-Key"];
	log.Println("GalaxyApiKey ", jwtToken);
	delete(headers, "Galaxy-Api-Key");
	userID := 0;
    
	   // Decode and validate the JWT
	   token, err := jwt.Parse(jwtToken, func(token *jwt.Token) (interface{}, error) {
		   // Here you should return the key used to sign the token
		   // This could be a secret key or a public key depending on your JWT signing method
		   return []byte("process.env.NEXTAUTH_SECRET!"), nil
	   })
   
	   if err != nil {
		   c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
		   return
	   }
   
	   if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		   // The token is valid, you can now access the claims
		   // For example, if you have a claim named "user_id":
		   if userIDFloat, ok := claims["userId"].(float64); ok {
            userID = int(userIDFloat)
            log.Printf("Authenticated user ID: %v", userID)
        } else {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user ID in token"})
            return
        }

		   // You can add the userID or other claims to your requestData if needed
	   } else {
		   c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token claims"})
		   return
	   }

	// Extract query parameters from the incoming request
	params := make(map[string]string)
	for k, v := range c.Request.URL.Query() {
		params[k] = strings.Join(v, ", ")
	}

	log.Println("result ", path)
	log.Println("result ", apiID)
	log.Println("result ", method)
	log.Println("result ", headers)
	log.Println("result ", params)

	// Extract request body (if present)
	var requestBody map[string]string
	if c.Request.Body != nil {
		body, _ := ioutil.ReadAll(
			c.Request.Body)
		c.Request.Body.Close()
		json.Unmarshal(body, &requestBody)
	}
	log.Println("result ", requestBody)

	// Create a RequestData struct with the extracted information

	requestData := types.RequestData{
		Method:     method,
		URL:        path,
		Headers:    headers,
		Params:     params,
		Data:       requestBody,
		EndpointID: 00,
		ApiID:      apiID,
		UserID:     userID,
	}

	log.Println("result ", requestData)

	// Pass the RequestData struct to your service
	response, err := h.service.SendRequest(c, requestData)
	if err != nil {
		// Handle the error
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Copy the headers from the response to the Gin context
	// Copy the headers from the response to the Gin context, replacing existing headers if needed
	for key, values := range response.Header {
		// Remove existing header with the same key
		c.Writer.Header().Del(key)
		// Add or set the new header value(s)
		for _, value := range values {
			c.Writer.Header().Set(key, value)
		}
	}

	// Set the status code
	c.Writer.WriteHeader(response.StatusCode)

	// Copy the response body to the Gin context
	_, err = io.Copy(c.Writer, response.Body)
	if err != nil {
		// Handle the error
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Close the response body
	response.Body.Close()
}

func (h *ApiHandler) HandleHealthCheackSendRequest(c *gin.Context) {

	var requestData types.HealthRequestData
	if err := c.BindJSON(&requestData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	// Handle the health check request logic here
	log.Printf("Received health check request: %+v", requestData)

	response, err := h.service.HealthCheackSendRequest(c, requestData.ApiID, requestData.EndpointID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": response})

}
