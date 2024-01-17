package service

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type MyHandler struct {
    service * Service
}

func NewMyHandler(s * Service) *MyHandler {
    return &MyHandler{service: s}
}

func (h *MyHandler) HandleRequest(c *gin.Context) {
    result := "h.myservice.Hello()"
    c.JSON(200, gin.H{"message": result})
}



func (h *MyHandler) GetAllApis(c *gin.Context) {
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

func (h *MyHandler) CreateApi(c *gin.Context) {
    var api CreateApiDto // Replace with your actual model
    if err := c.ShouldBindJSON(&api); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    result, err := h.service.Create(c,api)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Error creating API"})
        return
    }

    c.JSON(http.StatusCreated, result)
}

func (h *MyHandler) GetApi(c *gin.Context) {
    id, err := strconv.Atoi(c.Param("id"))
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
        return
    }

    api, err := h.service.GetOne(c,id)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Error fetching API"})
        return
    }

    c.JSON(http.StatusOK, api)
}

func (h *MyHandler) UpdateApi(c *gin.Context) {
    id, err := strconv.Atoi(c.Param("id"))
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
        return
    }

    var api UpdateApiDto // Replace with your actual model
    if err := c.ShouldBindJSON(&api); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    updatedApi, err := h.service.Update(c,id, api)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Error updating API"})
        return
    }

    c.JSON(http.StatusOK, updatedApi)
}

func (h *MyHandler) DeleteApi(c *gin.Context) {
    id, err := strconv.Atoi(c.Param("id"))
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
        return
    }

    err = h.service.Delete(c,id)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Error deleting API"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "API deleted successfully"})
}