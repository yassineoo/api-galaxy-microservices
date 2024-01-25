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

type ApiCollectionHandler struct {
    service *services.Service
}

func NewApiCollectionHandler(s *services.Service) *ApiCollectionHandler {
    return &ApiCollectionHandler{service: s}
}



// @Summary Create API Collection
// @Description Creates a new API Collection with the provided data
// @Accept json
// @Produce json
// @Tags ApiCollection Operations
// @Param collection body types.ApiCollectionDto true "API Collection Data"
// @Success 201 {object} map[string]interface{}
// @Failure 400 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /apiCollections [post]
func (h *ApiCollectionHandler) CreateCollection(c *gin.Context) {
    var collectionDto types.ApiCollectionDto
    if err := c.ShouldBindJSON(&collectionDto); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    collection, err := h.service.CreateCollection(c, collectionDto.Name, collectionDto.Description)
    if err != nil {
        log.Println("Error creating API Collection:", err)
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Error creating API Collection"})
        return
    }

    c.JSON(http.StatusCreated, collection)
}





// @Summary Get All API Collections
// @Description Retrieve all API Collections
// @Produce json
// @Tags ApiCollection Operations
// @Success 200 {object} []map[string]interface{}
// @Failure 500 {object} map[string]string
// @Router /apiCollections [get]
func (h *ApiCollectionHandler) GetCollections(c *gin.Context) {
    collections, err := h.service.GetCollections(c)
    if err != nil {
        log.Println("Error fetching API Collections:", err)
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Error fetching API Collections"})
        return
    }

    c.JSON(http.StatusOK, collections)
}





// @Summary Update API Collection by ID
// @Description Updates the API Collection with the given ID
// @Accept json
// @Produce json
// @Tags ApiCollection Operations
// @Param id path int true "API Collection ID"
// @Param collection body types.UpdateApiCollectionDto true "API Collection Data"
// @Success 200 {object} map[string]interface{}
// @Failure 400 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /apiCollections/{id} [put]
func (h *ApiCollectionHandler) UpdateCollection(c *gin.Context) {
    id, err := strconv.Atoi(c.Param("id"))
    if err != nil {
        log.Println("Error updating API Collection:", err)
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
        return
    }

    var collectionDto types.ApiCollectionDto
    if err := c.ShouldBindJSON(&collectionDto); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    updatedCollection, err := h.service.UpdateCollection(c, id, collectionDto.Name, collectionDto.Description)
    if err != nil {
        log.Println("Error updating API Collection:", err)
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Error updating API Collection"})
        return
    }

    c.JSON(http.StatusOK, updatedCollection)
}








// @Summary Add APIs to Collection
// @Description Adds a list of APIs to a specified collection
// @Accept json
// @Produce json
// @Tags ApiCollection Operations
// @Param id path int true "API Collection ID"
// @Param apiIDs body []int true "List of API IDs"
// @Success 200 {object} map[string]string
// @Failure 400 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /apiCollections/{id}/addApis [post]
func (h *ApiCollectionHandler) AddApisToCollection(c *gin.Context) {
    collectionID, err := strconv.Atoi(c.Param("id"))
    if err != nil {
        log.Println("Error parsing collection ID:", err)
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid collection ID"})
        return
    }

    var apiIDs []int
    if err := c.ShouldBindJSON(&apiIDs); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    if err := h.service.AddToCollection(c, collectionID, apiIDs); err != nil {
        log.Println("Error adding APIs to collection:", err)
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Error adding APIs to collection"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "APIs added to collection successfully"})
}



// @Summary Remove APIs from Collection
// @Description Removes a list of APIs from a specified collection
// @Accept json
// @Produce json
// @Tags ApiCollection Operations
// @Param id path int true "API Collection ID"
// @Param apiIDs body []int true "List of API IDs"
// @Success 200 {object} map[string]string
// @Failure 400 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /apiCollections/{id}/removeApis [post]
func (h *ApiCollectionHandler) RemoveApisFromCollection(c *gin.Context) {
    collectionID, err := strconv.Atoi(c.Param("id"))
    if err != nil {
        log.Println("Error parsing collection ID:", err)
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid collection ID"})
        return
    }

    var apiIDs []int
    if err := c.ShouldBindJSON(&apiIDs); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    if err := h.service.RemoveFromCollection(c, collectionID, apiIDs); err != nil {
        log.Println("Error removing APIs from collection:", err)
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Error removing APIs from collection"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "APIs removed from collection successfully"})
}








// @Summary Delete API Collection by ID
// @Description Deletes the API Collection with the provided ID
// @Produce json
// @Tags ApiCollection Operations
// @Param id path int true "API Collection ID"
// @Success 200 {object} map[string]string
// @Failure 400 {object} map[string]string
// @Failure 404 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /apiCollections/{id} [delete]
func (h *ApiCollectionHandler) DeleteCollection(c *gin.Context) {
    id, err := strconv.Atoi(c.Param("id"))
    if err != nil {
        log.Println("Error deleting API Collection:", err)
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
        return
    }

    err = h.service.DeleteCollection(c, id)
    if err != nil {
        log.Println("Error deleting API Collection:", err)
        if strings.Contains(err.Error(), "not found") {
            c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
        } else {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Error deleting API Collection"})
        }
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "API Collection deleted successfully"})
}
