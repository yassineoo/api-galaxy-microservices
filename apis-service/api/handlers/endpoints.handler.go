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
// @Param endpoints body types.createEndpointsDto true "API Endpoints Data"
// @Success 201 {object} map[string]interface{}
// @Failure 400 {object} map[string]string
// @Router /endpoints [post]
func (h *EndpointsHandler) CreateApiEndpoints(c *gin.Context) {
    var endpoint types.EndpointsDto
    if err := c.ShouldBindJSON(&endpoint); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    result, err := h.service.CreateApiEndpoints(c, endpoint)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Error creating API Endpoints"})
        return
    }

    c.JSON(http.StatusCreated, result)
}

// @Summary Get API Endpointss by API ID
// @Description Retrieves endpointss for a specific API
// @Tags API Endpoints Operations
// @Produce json
// @Param api-id path int true "API ID"
// @Success 200 {object} map[string]interface{}
// @Failure 400 {object} map[string]string
// @Router /endpoints/:api-id [get]
func (h *EndpointsHandler) GetApiEndpointss(c *gin.Context) {
    apiID, err := strconv.Atoi(c.Param("api-id"))
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid API ID"})
        return
    }

    endpointss, err := h.service.GetApiEndpointss(c, apiID)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Error fetching API Endpointss"})
        return
    }

    c.JSON(http.StatusOK, endpointss)
}

// @Summary Update an API Endpoints
// @Description Updates an existing API Endpoints
// @Tags API Endpoints Operations
// @Accept json
// @Produce json
// @Param id path int true "Endpoints ID"
// @Param endpoints body types.CreateEndpointsDto true "API Endpoints Data"
// @Success 200 {object} map[string]interface{}
// @Failure 400 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /endpoints/:id [patch]
func (h *EndpointsHandler) UpdateApiEndpoints(c *gin.Context) {
    endpointsID, err := strconv.Atoi(c.Param("id"))
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Endpoints ID"})
        return
    }

    var endpoints types.EndpointsDto
    if err := c.ShouldBindJSON(&endpoints); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    updatedEndpoints, err := h.service.UpdateApiEndpoints(c, endpointsID, endpoints)
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
// @Router /endpoints/:id [delete]
func (h *EndpointsHandler) DeleteApiEndpoints(c *gin.Context) {
    endpointsID, err := strconv.Atoi(c.Param("id"))
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Endpoints ID"})
        return
    }

    err = h.service.DeleteApiEndpoints(c, endpointsID)
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





















// @Summary Create an Endpoints Group
// @Description Creates a new Endpoints Group
// @Tags Endpoints Group Operations
// @Accept json
// @Produce json
// @Param endpoints-group body types.EndpointsGroupDto true "Endpoints Group Data"
// @Success 201 {object} map[string]interface{}
// @Failure 400 {object} map[string]string
// @Router /endpoints-group [post]
func (h *EndpointsHandler) CreateEndpointsGroup(c *gin.Context) {
    var endpointsGroup types.EndpointsGroupDto
    if err := c.ShouldBindJSON(&endpointsGroup); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    result, err := h.service.CreateEndpointsGroup(c, endpointsGroup)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Error creating Endpoints Group"})
        return
    }

    c.JSON(http.StatusCreated, result)
}

// @Summary Get All Endpoints Groups
// @Description Retrieves all Endpoints Groups
// @Tags Endpoints Group Operations
// @Produce json
// @Param page query int false "Page number"
// @Param limit query int false "Number of items per page"
// @Success 200 {object} map[string]interface{}
// @Failure 400 {object} map[string]string
// @Router /endpoints-group [get]
func (h *EndpointsHandler) GetApiEndpointsGroups(c *gin.Context) {
    apiID, err := strconv.Atoi(c.Param("api-id"))
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid API ID"})
        return
    }

    endpointsGroups, err := h.service.GetApiGroups(c, apiID)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Error fetching Endpoints Groups"})
        return
    }

    c.JSON(http.StatusOK, endpointsGroups)
}

// @Summary Update an Endpoints Group
// @Description Updates an existing Endpoints Group
// @Tags Endpoints Group Operations
// @Accept json
// @Produce json
// @Param id path int true "Endpoints Group ID"
// @Param endpoints-group body types.EndpointsGroupDto true "Endpoints Group Data"
// @Success 200 {object} map[string]interface{}
// @Failure 400 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /endpoints-group/:id [patch]
func (h *EndpointsHandler) UpdateEndpointsGroup(c *gin.Context) {
    endpointsGroupID, err := strconv.Atoi(c.Param("id"))
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Endpoints Group ID"})
        return
    }

    var endpointsGroup types.EndpointsGroupDto
    if err := c.ShouldBindJSON(&endpointsGroup); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    updatedEndpointsGroup, err := h.service.UpdateEndpointsGroup(c, endpointsGroupID, endpointsGroup)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Error updating Endpoints Group"})
        return
    }

    c.JSON(http.StatusOK, updatedEndpointsGroup)
}

// @Summary Delete an Endpoints Group
// @Description Deletes a specific Endpoints Group
// @Tags Endpoints Group Operations
// @Produce json
// @Param id path int true "Endpoints Group ID"
// @Success 200 {object} map[string]string
// @Failure 400 {object} map[string]string
// @Failure 404 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /endpoints-group/:id [delete]
func (h *EndpointsHandler) DeleteEndpointsGroup(c *gin.Context) {
    endpointsGroupID, err := strconv.Atoi(c.Param("id"))
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Endpoints Group ID"})
        return
    }

    err = h.service.DeleteEndpointsGroup(c, endpointsGroupID)
    if err != nil {
        if strings.Contains(err.Error(), "not found") {
            c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
        } else {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Error deleting Endpoints Group"})
        }
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "Endpoints Group deleted successfully"})
}





















