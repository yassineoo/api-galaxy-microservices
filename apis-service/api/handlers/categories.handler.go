package handlers

import (
	"net/http"
	"strconv"
	"strings"

	"local_packages/api/services"
	"local_packages/api/types"

	"github.com/gin-gonic/gin"
)

type CategoryHandler struct {
	service *services.Service

}

func NewCategoryHandler(s *services.Service) *CategoryHandler {
	return &CategoryHandler{service: s}
}


// @Summary Get all categories
// @Description Retrieves a paginated list of categories
// @Produce json
// @Tags Category Operations
// @Param page query int false "Page number"
// @Param limit query int false "Results per page"
// @Success 200 {object} map[string]interface{}
// @Failure 400 {object} map[string]string
// @Router /categories [get]
func (h *CategoryHandler) GetAllCategories(c *gin.Context) {
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

// @Summary Create a new category
// @Description Creates a new category from the provided data
// @Accept json
// @Produce json
// @Tags Category Operations
// @Param category body CategoryDto true "Category Data"
// @Success 201 {object} map[string]interface{}
// @Failure 400 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /categories [post]
func (h *CategoryHandler) CreateCategory(c *gin.Context) {
	var category types.CategoryDto // Replace with your actual model
	if err := c.ShouldBindJSON(&category); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	result, err := h.service.CreateCategory(c,category )
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error creating API Catgory"})
		return
	}

	c.JSON(http.StatusCreated, result)
}



// @Summary Update a category
// @Description Updates an existing category with the given ID
// @Accept json
// @Produce json
// @Tags Category Operations
// @Param id path int true "Category ID"
// @Param category body CategoryDto true "Category Data"
// @Success 200 {object} map[string]interface{}
// @Failure 400 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /categories/{id} [put]
func (h *CategoryHandler) UpdateCategory(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	var category types.CategoryDto // Replace with your actual model
	if err := c.ShouldBindJSON(&category); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}


	updatedApi, err := h.service.UpdateCategory(c, id, category)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error updating API Category"})
		return
	}

	c.JSON(http.StatusOK, updatedApi)
}


// @Summary Delete a category
// @Description Deletes the category with the provided ID
// @Produce json
// @Tags Category Operations
// @Param id path int true "Category ID"
// @Success 200 {object} map[string]string
// @Failure 400 {object} map[string]string
// @Failure 404 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /categories/{id} [delete]
func (h *CategoryHandler) DeleteCategory(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}
	err = h.service.DeleteCategory(c, id)
	if err != nil {
		// Check if the error message indicates "not found"
		if strings.Contains(err.Error(), "not found") {
		 c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
	 } else {
		 c.JSON(http.StatusInternalServerError, gin.H{"error": "Error deleting API Category"})
	 }
	 return
 }

	c.JSON(http.StatusOK, gin.H{"message": "Category deleted successfully"})
}
