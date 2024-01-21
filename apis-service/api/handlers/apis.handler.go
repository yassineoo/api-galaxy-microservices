package handlers

import (
	"log"
	"net/http"
	"strconv"
	"strings"

	"local_packages/api/services"
	"local_packages/api/types"

	"github.com/gin-gonic/gin"
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

	// Call the GetAll service method
	data, err := h.service.GetAll(c, page, limit)
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
// @Param api body types.CreateApiDto true "API Data"
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
// @Success 200 {object} ApiResponse
// @Failure 400 {object} error
// @Router /apis/{id} [get]
func (h *ApiHandler) GetApi(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	api, err := h.service.GetOne(c, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error fetching API"})
		return
	}

	c.JSON(http.StatusOK, api)
}

// @Summary Update API by ID
// @Description Updates the API with the given ID
// @Accept json
// @Produce json
// @Tags Apis Operations
// @Param id path int true "API ID"
// @Param api body UpdateApiDto true "API Data"
// @Success 200 {object} map[string]interface{}
// @Failure 400 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /apis/{id} [put]
func (h *ApiHandler) UpdateApi(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
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
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	err = h.service.Delete(c, id)
	if err != nil {
		   // Check if the error message indicates "not found"
		   if strings.Contains(err.Error(), "not found") {
            c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
        } else {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Error deleting API"})
        }
        return
	}

	c.JSON(http.StatusOK, gin.H{"message": "API deleted successfully"})
}
