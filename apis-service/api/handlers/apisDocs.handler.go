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

type ApiDocsHandler struct {
	service *services.Service
}

func NewApiDocsHandler(s *services.Service) *ApiDocsHandler {
	return &ApiDocsHandler{service: s}
}

func (h *ApiDocsHandler) HandleRequest(c *gin.Context) {
	result := "h.myservice.Hello()"
	c.JSON(200, gin.H{"message": result})
}



// @Summary Create APIDocs
// @Description Creates a new APIDocs from the provided data
// @Accept json
// @Produce json
// @Tags ApiDocss Operations
// @Param apiDocs body types.ApiDocsDto true "APIDocs Data"
// @Success 201 {object} map[string]interface{}
// @Failure 400 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /apiDocss [post]
func (h *ApiDocsHandler) CreateApiDocs(c *gin.Context) {
	var apiDocs types.ApiDocsDto // Replace with your actual model
	if err := c.ShouldBindJSON(&apiDocs); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	result, err := h.service.CreateApiDocs(c, apiDocs)
	if err != nil {
		// Log the actual error
		log.Println("Error creating APIDocs:", err)

		// Return a customized error message to the client
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error creating APIDocs"})
		return
	}

	c.JSON(http.StatusCreated, result)
}

// @Summary Get APIDocs by ID
// @Description Retrieve APIDocs details based on the provided ID.
// @ID get-apiDocs-by-id
// @Produce json
// @Tags ApiDocss Operations
// @Param id path int true "APIDocs ID"
// @Success 200 {object} map[string]interface{}
// @Failure 400 {object} error
// @Router /apiDocss/{api-id} [get]
func (h *ApiDocsHandler) GetApiDocs(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		// Log the actual error
		log.Println("Error creating APIDocs:", err)

		// Return a customized error message to the client
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	apiDocs, err := h.service.GetApiDocs(c, id)
	if err != nil {
		// Log the actual error
		log.Println("Error creating APIDocs:", err)

		// Return a customized error message to the client
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error fetching APIDocs"})
		return
	}

	c.JSON(http.StatusOK, apiDocs)
}

// @Summary Update APIDocs by ID
// @Description Updates the APIDocs with the given ID
// @Accept json
// @Produce json
// @Tags ApiDocss Operations
// @Param id path int true "APIDocs ID"
// @Param apiDocs body types.UpdateApiDocsDto true "APIDocs Data"
// @Success 200 {object} map[string]interface{}
// @Failure 400 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /apiDocss/{id} [put]
func (h *ApiDocsHandler) UpdateApiDocs(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		// Log the actual error
		log.Println("Error creating APIDocs:", err)

		// Return a customized error message to the client
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	var apiDocs types.ApiDocsDto // Replace with your actual model
	if err := c.ShouldBindJSON(&apiDocs); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	log.Println("apiDocs")
	log.Println(apiDocs)

	updatedApiDocs, err := h.service.UpdateApiDocs(c, id, apiDocs)
	if err != nil {
		// Log the actual error
		log.Println("Error creating APIDocs:", err)

		// Return a customized error message to the client
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error updating APIDocs"})
		return
	}

	c.JSON(http.StatusOK, updatedApiDocs)
}

// @Summary Delete APIDocs by ID
// @Description Deletes the APIDocs with the provided ID
// @Produce json
// @Tags ApiDocss Operations
// @Param id path int true "APIDocs ID"
// @Success 200 {object} map[string]string
// @Failure 400 {object} map[string]string
// @Failure 404 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /apiDocss/{id} [delete]
func (h *ApiDocsHandler) DeleteApiDocs(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		// Log the actual error
		log.Println("Error creating APIDocs:", err)

		// Return a customized error message to the client
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	err = h.service.DeleteApiDocs(c, id)
	if err != nil {
		// Log the actual error
		log.Println("Error creating APIDocs:", err)

		// Return a customized error message to the client
		   // Check if the error message indicates "not found"
		   if strings.Contains(err.Error(), "not found") {
            c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
        } else {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Error deleting APIDocs"})
        }
        return
	}

	c.JSON(http.StatusOK, gin.H{"message": "APIDocs deleted successfully"})
}
