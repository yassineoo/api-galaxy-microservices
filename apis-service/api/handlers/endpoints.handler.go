package handlers

import (
	"net/http"
	"strconv"
	"strings"

	"local_packages/api/services"
	"local_packages/api/types"

	"github.com/gin-gonic/gin"
)

type EndpointsHandler struct {
    service *services.Service
}

func NewEndpointsHandler(s *services.Service) *EndpointsHandler {
    return &EndpointsHandler{service: s}
}

// @Summary Create an API Endpoints
// @Description Creates a new API Endpoints
// @Tags API Endpoints Operations
// @Accept json
// @Produce json
// @Param plan body types.createEndpointsDto true "API Endpoints Data"
// @Success 201 {object} map[string]interface{}
// @Failure 400 {object} map[string]string
// @Router /plan [post]
func (h *EndpointsHandler) CreateApiEndpoints(c *gin.Context) {
    var plan types.CreateEndpointsDto
    if err := c.ShouldBindJSON(&plan); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    result, err := h.service.CreateApiEndpoints(c, plan)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Error creating API Endpoints"})
        return
    }

    c.JSON(http.StatusCreated, result)
}

// @Summary Get API Endpointss by API ID
// @Description Retrieves plans for a specific API
// @Tags API Endpoints Operations
// @Produce json
// @Param api-id path int true "API ID"
// @Success 200 {object} map[string]interface{}
// @Failure 400 {object} map[string]string
// @Router /plan/:api-id [get]
func (h *EndpointsHandler) GetApiEndpointss(c *gin.Context) {
    apiID, err := strconv.Atoi(c.Param("api-id"))
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid API ID"})
        return
    }

    plans, err := h.service.GetApiEndpointss(c, apiID)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Error fetching API Endpointss"})
        return
    }

    c.JSON(http.StatusOK, plans)
}

// @Summary Update an API Endpoints
// @Description Updates an existing API Endpoints
// @Tags API Endpoints Operations
// @Accept json
// @Produce json
// @Param id path int true "Endpoints ID"
// @Param plan body types.CreateEndpointsDto true "API Endpoints Data"
// @Success 200 {object} map[string]interface{}
// @Failure 400 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /plan/:id [patch]
func (h *EndpointsHandler) UpdateApiEndpoints(c *gin.Context) {
    planID, err := strconv.Atoi(c.Param("id"))
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Endpoints ID"})
        return
    }

    var plan types.CreateEndpointsDto
    if err := c.ShouldBindJSON(&plan); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    updatedEndpoints, err := h.service.UpdateApiEndpoints(c, planID, plan)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Error updating API Endpoints"})
        return
    }

    c.JSON(http.StatusOK, updatedEndpoints)
}

// @Summary Delete an API Endpoints
// @Description Deletes a specific API Endpoints
// @Tags API Endpoints Operations
// @Produce json
// @Param id path int true "Endpoints ID"
// @Success 200 {object} map[string]string
// @Failure 400 {object} map[string]string
// @Failure 404 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /plan/:id [delete]
func (h *EndpointsHandler) DeleteApiEndpoints(c *gin.Context) {
    planID, err := strconv.Atoi(c.Param("id"))
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Endpoints ID"})
        return
    }

    err = h.service.DeleteApiEndpoints(c, planID)
    if err != nil {
        if strings.Contains(err.Error(), "not found") {
            c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
        } else {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Error deleting API Endpoints"})
        }
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "API Endpoints deleted successfully"})
}
