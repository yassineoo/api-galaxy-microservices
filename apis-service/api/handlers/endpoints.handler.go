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
// @Param endpoints body types.EndpointsDto true "API Endpoints Data"
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
        log.Println("Error ", err)
        
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
func (h *EndpointsHandler) GetApiEndpoints(c *gin.Context) {
    apiID, err := strconv.Atoi(c.Param("api-id"))
    if err != nil {
        log.Println("Error ", err)
        
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid API ID"})
        return
    }

    endpointss, err := h.service.GetApiEndpoints(c, apiID)
    if err != nil {
        log.Println("Error ", err)
        
        log.Println("Error fetching  API Endpoints:", err)
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
// @Param endpoints body types.EndpointsDto true "API Endpoints Data"
// @Success 200 {object} map[string]interface{}
// @Failure 400 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /endpoints/:id [patch]
func (h *EndpointsHandler) UpdateApiEndpoints(c *gin.Context) {
    endpointsID, err := strconv.Atoi(c.Param("id"))
    if err != nil {
        log.Println("Error ", err)
        
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
        log.Println("Error ", err)
        
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
        log.Println("Error ", err)
        
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Endpoints ID"})
        return
    }

    err = h.service.DeleteApiEndpoints(c, endpointsID)
    if err != nil {
        log.Println("Error ", err)
        
        if strings.Contains(err.Error(), "not found") {
            c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
        } else {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Error deleting API Endpoints"})
        }
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "API Endpoints deleted successfully"})
}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               







// endpoints-group
// endpoints-group
// endpoints-group
// endpoints-group
// endpoints-group
// endpoints-group
// endpoints-group
// endpoints-group
// endpoints-group
// endpoints-group
// endpoints-group
// endpoints-group
// endpoints-group
// endpoints-group
// endpoints-group
// endpoints-group
// endpoints-group
// endpoints-group
// endpoints-group
// endpoints-group







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
        log.Println("Error ", err)

        
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
        log.Println("Error ", err)

        
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid API ID"})
        return
    }

    endpointsGroups, err := h.service.GetApiGroups(c, apiID)
    if err != nil {
        log.Println("Error ", err)

        
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
        log.Println("Error ", err)

        
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
        log.Println("Error ", err)

        
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
        log.Println("Error ", err)

        
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Endpoints Group ID"})
        return
    }

    err = h.service.DeleteEndpointsGroup(c, endpointsGroupID)
    if err != nil {
        log.Println("Error ", err)

        
        if strings.Contains(err.Error(), "not found") {
            c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
        } else {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Error deleting Endpoints Group"})
        }
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "Endpoints Group deleted successfully"})
}







//  ------------------------------- endpoints-endpoints parameters -----------------------------------
//  ------------------------------- endpoints-endpoints parameters -----------------------------------
//  ------------------------------- endpoints-endpoints parameters -----------------------------------
//  ------------------------------- endpoints-endpoints parameters -----------------------------------
//  ------------------------------- endpoints-endpoints parameters -----------------------------------
//  ------------------------------- endpoints-endpoints parameters -----------------------------------
//  ------------------------------- endpoints-endpoints parameters -----------------------------------
//  ------------------------------- endpoints-endpoints parameters -----------------------------------
//  ------------------------------- endpoints-endpoints parameters -----------------------------------
//  ------------------------------- endpoints-endpoints parameters -----------------------------------
//  ------------------------------- endpoints-endpoints parameters -----------------------------------
//  ------------------------------- endpoints-endpoints parameters -----------------------------------
//  ------------------------------- endpoints-endpoints parameters -----------------------------------
//  ------------------------------- endpoints-endpoints parameters -----------------------------------
//  ------------------------------- endpoints-endpoints parameters -----------------------------------

// @Summary Create an Endpoints Parameter
// @Description Creates a new Endpoints Parameter
// @Tags Endpoints Parameter Operations
// @Accept json
// @Produce json
// @Param endpoints-parameter body types.EndpointsParameterDto true "Endpoints Parameter Data"
// @Success 201 {object} models.EndpointsParameterEntity
// @Failure 400 {object} map[string]string
// @Router /endpoints-parameter [post]
func (h *EndpointsHandler) CreateEndpointsParameter(c *gin.Context) {
    var endpointsParameter types.EndpointsParameterDto
    if err := c.ShouldBindJSON(&endpointsParameter); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    result, err := h.service.CreateEndpointsParameter(c, endpointsParameter)
    if err != nil {
        log.Println("Error ", err)

        
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Error creating Endpoints Parameter"})
        return
    }

    c.JSON(http.StatusCreated, result)
}


// @Summary Get All Endpoints Parameters
// @Description Retrieves all Endpoints Parameters for a specific Endpoint
// @Tags Endpoints Parameter Operations
// @Produce json
// @Param endpoint-id path int true "Endpoint ID"
// @Success 200 {array} models.EndpointsParameterEntity
// @Failure 400 {object} map[string]string
// @Router /endpoints-parameter/{endpoint-id} [get]
func (h *EndpointsHandler) GetEndpointParameters(c *gin.Context) {
    endpointID, err := strconv.Atoi(c.Param("endpoint-id"))
    if err != nil {
        log.Println("Error ", err)

        
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Endpoint ID"})
        return
    }

    endpointsParameters, err := h.service.GetEndpointParameter(c, endpointID)
    if err != nil {
        log.Println("Error ", err)

        
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Error fetching Endpoints Parameters"})
        return
    }

    c.JSON(http.StatusOK, endpointsParameters)
}









// @Summary Update an Endpoints Parameter
// @Description Updates an existing Endpoints Parameter
// @Tags Endpoints Parameter Operations
// @Accept json
// @Produce json
// @Param id path int true "Endpoints Parameter ID"
// @Param endpoints-parameter body types.EndpointsParameterDto true "Endpoints Parameter Data"
// @Success 200 {object} models.EndpointsParameterEntity
// @Failure 400 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /endpoints-parameter/{id} [patch]
func (h *EndpointsHandler) UpdateEndpointsParameter(c *gin.Context) {
    endpointsParameterID, err := strconv.Atoi(c.Param("id"))
    if err != nil {
        log.Println("Error ", err)

        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Endpoints Parameter ID"})
        return
    }

    var endpointsParameter types.EndpointsParameterDto
    if err := c.ShouldBindJSON(&endpointsParameter); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    updatedEndpointsParameter, err := h.service.UpdateEndpointsParameter(c, endpointsParameterID, endpointsParameter)
    if err != nil {
        log.Println("Error ", err)

        c.JSON(http.StatusInternalServerError, gin.H{"error": "Error updating Endpoints Parameter"})
        return
    }

    c.JSON(http.StatusOK, updatedEndpointsParameter)
}









// @Summary Delete an Endpoints Parameter
// @Description Deletes a specific Endpoints Parameter
// @Tags Endpoints Parameter Operations
// @Produce json
// @Param id path int true "Endpoints Parameter ID"
// @Success 200 {object} map[string]string
// @Failure 400 {object} map[string]string
// @Failure 404 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /endpoints-parameter/{id} [delete]
func (h *EndpointsHandler) DeleteEndpointsParameter(c *gin.Context) {
    endpointsParameterID, err := strconv.Atoi(c.Param("id"))
    if err != nil {
        log.Println("Error ", err)

        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Endpoints Parameter ID"})
        return
    }

    err = h.service.DeleteEndpointsParameter(c, endpointsParameterID)
    if err != nil {
        log.Println("Error ", err)

        if strings.Contains(err.Error(), "not found") {
            c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
        } else {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Error deleting Endpoints Parameter"})
        }
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "Endpoints Parameter deleted successfully"})
}




















// CreateBodyParamAndParametersHandler handles the creation of a BodyParamEntity along with associated Parameters.
//
// This endpoint creates a new BodyParamEntity and its associated Parameters based on the provided BodyParamDto.
//
// @Summary Create a BodyParamEntity with Parameters
// @Description Create a new BodyParamEntity and its associated Parameters.
// @Tags BodyParams
// @Accept json
// @Produce json
// @Param bodyParamDto body types.BodyParamDto true "BodyParamDto object containing EndpointID, ContentType, TextBody, and Parameters"
// @Success 200 {object} models.BodyParamEntity
// @Router /create-body-param-and-parameters [post]
func (h * EndpointsHandler) CreateBodyParamAndParameters(c *gin.Context) {
    // Parse the request body into a BodyParamDto
    var bodyParamDto types.BodyParamDto
    if err := c.ShouldBindJSON(&bodyParamDto); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    // Call the service function to create the BodyParamEntity and Parameters
    result, err := h.service.CreateBodyParamAndParameters(c, bodyParamDto)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Error creating BodyParamEntity and Parameters"})
        return
    }

    // Respond with the created BodyParamEntity
    c.JSON(http.StatusCreated, result)
}
