package handlers

import (
	"log"
	"net/http"
	"strconv"

	"local_packages/api/services"
	"local_packages/api/types"

	"github.com/gin-gonic/gin"
)

type LogsHandler struct {
	service *services.Service

}

func NewLogsHandler(s *services.Service) *LogsHandler {
	return &LogsHandler{service: s}
}


// @Summary Get all categories
// @Description Retrieves a paginated list of categories
// @Produce json
// @Tags Logs Operations
// @Param page query int false "Page number"
// @Param limit query int false "Results per page"
// @Success 200 {object} map[string]interface{}
// @Failure 400 {object} map[string]string
// @Router /categories [get]
func (h *LogsHandler) GetApiLogs(c *gin.Context) {
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

    plans, err := h.service.GetApiLogs(c, apiID , page, limit)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Error fetching API Plans"})
        return
    }

    c.JSON(http.StatusOK, plans)
}












// @Summary Get last 7 days statistics for multiple endpoints
// @Description Retrieves statistics for multiple endpoints for the last 7 days
// @Produce json
// @Tags Logs Operations
// @Accept json
// @Param endpoint-ids body []int true "Endpoint IDs"
// @Success 200 {array} map[string]interface{}
// @Failure 400 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /logs/stats [post]
func (h *LogsHandler) GetLast7DaysStats(c *gin.Context) {
	var EndpointIds types.EndpointsIDsDto

	// Bind the JSON body to the EndpointIds slice
	if err := c.ShouldBindJSON(&EndpointIds); err != nil {
		log.Println("Error binding JSON:", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON body"})
		return
	}



	// Assuming GetLast7DaysStatistics returns an array of 7 objects as mentioned
	stats, err := h.service.GetLast7DaysStatistics(c, EndpointIds.EndpointIds)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error fetching last 7 days' statistics"})
		return
	}

	c.JSON(http.StatusOK, stats)
}








func (h *LogsHandler) GetStatisticsByTimeFilter(c *gin.Context) {
	var EndpointStat types.EndpointStatDto

	// Bind the JSON body to the EndpointIds slice
	if err := c.ShouldBindJSON(&EndpointStat); err != nil {
		log.Println("Error binding JSON:", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON body"})
		return
	}



	// Assuming GetLast7DaysStatistics returns an array of 7 objects as mentioned
	stats, err := h.service.GetStatisticsByTimeFilter(c, EndpointStat)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error fetching last 7 days' statistics"})
		return
	}

	c.JSON(http.StatusOK, stats)
}



/*







// @Summary Create a new logs
// @Description Creates a new logs from the provided data
// @Accept json
// @Produce json
// @Tags Logs Operations
// @Param logs body types.LogsDto true "Logs Data"
// @Success 201 {object} map[string]interface{}
// @Failure 400 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /categories [post]
func (h *LogsHandler) CreateLogs(c *gin.Context) {
	var logs types.LogsDto // Replace with your actual model
	if err := c.ShouldBindJSON(&logs); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	result, err := h.service.CreateLogs(c,logs )
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error creating API Catgory"})
		return
	}

	c.JSON(http.StatusCreated, result)
}



// @Summary Update a logs
// @Description Updates an existing logs with the given ID
// @Accept json
// @Produce json
// @Tags Logs Operations
// @Param id path int true "Logs ID"
// @Param logs body types.LogsDto true "Logs Data"
// @Success 200 {object} map[string]interface{}
// @Failure 400 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /categories/{id} [put]
func (h *LogsHandler) UpdateLogs(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	var logs types.LogsDto // Replace with your actual model
	if err := c.ShouldBindJSON(&logs); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}


	updatedApi, err := h.service.UpdateLogs(c, id, logs)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error updating API Logs"})
		return
	}

	c.JSON(http.StatusOK, updatedApi)
}


// @Summary Delete a logs
// @Description Deletes the logs with the provided ID
// @Produce json
// @Tags Logs Operations
// @Param id path int true "Logs ID"
// @Success 200 {object} map[string]string
// @Failure 400 {object} map[string]string
// @Failure 404 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /categories/{id} [delete]
func (h *LogsHandler) DeleteLogs(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}
	err = h.service.DeleteLogs(c, id)
	if err != nil {
		// Check if the error message indicates "not found"
		if strings.Contains(err.Error(), "not found") {
		 c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
	 } else {
		 c.JSON(http.StatusInternalServerError, gin.H{"error": "Error deleting API Logs"})
	 }
	 return
 }

	c.JSON(http.StatusOK, gin.H{"message": "Logs deleted successfully"})
}


*/