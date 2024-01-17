package api

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type CategoriesHnadler struct {
	service *Service
}

func NewCategoriesHandler(s *Service) *MyHandler {
	return &MyHandler{service: s}
}



func (h *MyHandler) GetAllCategories(c *gin.Context) {
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
	data, err := h.service.GetAllCategories(c, page, limit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error fetching data"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": data})
}

func (h *MyHandler) CreateCategory(c *gin.Context) {
	var category CategoryDto // Replace with your actual model
	if err := c.ShouldBindJSON(&category); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	result, err := h.service.CreateCategory(c,category )
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error creating API"})
		return
	}

	c.JSON(http.StatusCreated, result)
}


func (h *MyHandler) UpdateCategory(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	var category CategoryDto // Replace with your actual model
	if err := c.ShouldBindJSON(&category); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}


	updatedApi, err := h.service.UpdateCategory(c, id, category)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error updating API"})
		return
	}

	c.JSON(http.StatusOK, updatedApi)
}

func (h *MyHandler) DeleteCategory(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	err = h.service.DeleteCategory(c, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error deleting API"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Category deleted successfully"})
}
