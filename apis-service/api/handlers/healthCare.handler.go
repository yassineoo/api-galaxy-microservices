package handlers

import (
	"log"
	"net/http"
	"strconv"

	"local_packages/api/services"
	"local_packages/api/types"

	"github.com/gin-gonic/gin"
)

type HealthCheckHandler struct {
	service *services.Service
}

func NewHealthCheckHandler(s *services.Service) *HealthCheckHandler {
	return &HealthCheckHandler{service: s}
}

// @Summary Create a Health Check
// @Description Creates a new Health Check for an API
// @Tags Health Checks
// @Accept json
// @Produce json
// @Param health-check body types.HealthCheckDto true "Health Check Data"
// @Success 201 {object} models.HealthCheckEntity
// @Failure 400 {object} map[string]string
// @Router /health-checks [post]
func (h *HealthCheckHandler) CreateHealthCheck(c *gin.Context) {
	var healthCheck types.HealthCheckDto
	if err := c.ShouldBindJSON(&healthCheck); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	result, err := h.service.CreateHealthCheck(c, healthCheck)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error creating Health Check"})
		return
	}

	c.JSON(http.StatusCreated, result)
}

// @Summary Get Health Check by API ID
// @Description Retrieves a Health Check for a specific API
// @Tags Health Checks
// @Produce json
// @Param api-id path int true "API ID"
// @Success 200 {object} models.HealthCheckEntity
// @Failure 400 {object} map[string]string
// @Router /health-checks/{api-id} [get]
func (h *HealthCheckHandler) GetHealthCheck(c *gin.Context) {
	apiID, err := strconv.Atoi(c.Param("api-id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid API ID"})
		return
	}

	healthCheck, err := h.service.GetHealthCheck(c, apiID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error fetching Health Check"})
		return
	}

	c.JSON(http.StatusOK, healthCheck)
}

// @Summary Update a Health Check
// @Description Updates an existing Health Check for an API
// @Tags Health Checks
// @Accept json
// @Produce json
// @Param id path int true "Health Check ID"
// @Param health-check body types.HealthCheckDto true "Health Check Data"
// @Success 200 {object} models.HealthCheckEntity
// @Failure 400 {object} map[string]string
// @Router /health-checks/{id} [patch]
func (h *HealthCheckHandler) UpdateHealthCheck(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Health Check ID"})
		return
	}

	var healthCheck types.HealthCheckDto
	if err := c.ShouldBindJSON(&healthCheck); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	updatedHealthCheck, err := h.service.UpdateHealthCheck(c, id, healthCheck)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error updating Health Check"})
		return
	}

	c.JSON(http.StatusOK, updatedHealthCheck)
}

// @Summary Delete a Health Check
// @Description Deletes a specific Health Check for an API
// @Tags Health Checks
// @Produce json
// @Param id path int true "Health Check ID"
// @Success 200 {object} map[string]string
// @Failure 400 {object} map[string]string
// @Failure 404 {object} map[string]string
// @Router /health-checks/{id} [delete]
func (h *HealthCheckHandler) DeleteHealthCheck(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Health Check ID"})
		return
	}

	err = h.service.DeleteHealthCheck(c, id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Health Check not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Health Check deleted successfully"})
}


// @Summary Get Health Check Success Percentage
// @Description Get the success percentage of health checks for a specific API
// @Tags Health Checks
// @Produce json
// @Param api-id path int true "API ID"
// @Success 200 {object} map[string]float64
// @Failure 400 {object} map[string]string "Invalid API ID"
// @Failure 500 {object} map[string]string "Internal Server Error"
// @Router /health-checks/{api-id}/success-percentage [get]
func (h *HealthCheckHandler) GetHealthCheckSuccessPercentage(c *gin.Context) {
	apiID, err := strconv.Atoi(c.Param("api-id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid API ID"})
		return
	}

	successPercentage, err := h.service.GetHealthCheckSuccessPercentage(c, apiID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error calculating Health Check Success Percentage"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"successPercentage": successPercentage})
}











func (h *HealthCheckHandler) GetApiHealthCheck(c *gin.Context) {
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

    apiID, err := strconv.Atoi(c.Param("api-id"))
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid API ID"})
        return
    }

    plans, err := h.service.GetApiHealthCheck(c, apiID , page, limit)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Error fetching API Plans"})
        return
    }

    c.JSON(http.StatusOK, plans)
}













/// stat 



func (h *HealthCheckHandler) GetApiHealthStats(c *gin.Context) {
    apiIDsParam := c.QueryArray("apiIds[]") // Use QueryArray to directly get an array of values

	log.Println("apiIDsParam", apiIDsParam)
    if len(apiIDsParam) == 0 {
        c.JSON(http.StatusBadRequest, gin.H{"error": "apiIds parameter is required"})
        return
    }

    parsedAPIIDs := make([]int, len(apiIDsParam)) // Avoid using append, preallocate the slice

    for i, idStr := range apiIDsParam {
        id, err := strconv.Atoi(idStr)
        if err != nil {
            c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid API ID format"})
            return
        }
        parsedAPIIDs[i] = id
    }

    stats, err := h.service.GetApiHealthStats(c.Request.Context(), parsedAPIIDs)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, stats)
}