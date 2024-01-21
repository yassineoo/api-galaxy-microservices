package handlers

import (
	"net/http"
	"strconv"
	"strings"

	"local_packages/api/services"
	"local_packages/api/types"

	"github.com/gin-gonic/gin"
)

type PlanHandler struct {
    service *services.Service
}

func NewPlanHandler(s *services.Service) *PlanHandler {
    return &PlanHandler{service: s}
}

// @Summary Create an API Plan
// @Description Creates a new API Plan
// @Tags API Plan Operations
// @Accept json
// @Produce json
// @Param plan body types.createPlanDto true "API Plan Data"
// @Success 201 {object} map[string]interface{}
// @Failure 400 {object} map[string]string
// @Router /plan [post]
func (h *PlanHandler) CreateApiPlan(c *gin.Context) {
    var plan types.PlanDto
    if err := c.ShouldBindJSON(&plan); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    result, err := h.service.CreateApiPlan(c, plan)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Error creating API Plan"})
        return
    }

    c.JSON(http.StatusCreated, result)
}

// @Summary Get API Plans by API ID
// @Description Retrieves plans for a specific API
// @Tags API Plan Operations
// @Produce json
// @Param api-id path int true "API ID"
// @Success 200 {object} map[string]interface{}
// @Failure 400 {object} map[string]string
// @Router /plan/:api-id [get]
func (h *PlanHandler) GetApiPlans(c *gin.Context) {
    apiID, err := strconv.Atoi(c.Param("api-id"))
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid API ID"})
        return
    }

    plans, err := h.service.GetApiPlans(c, apiID)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Error fetching API Plans"})
        return
    }

    c.JSON(http.StatusOK, plans)
}

// @Summary Update an API Plan
// @Description Updates an existing API Plan
// @Tags API Plan Operations
// @Accept json
// @Produce json
// @Param id path int true "Plan ID"
// @Param plan body types.CreatePlanDto true "API Plan Data"
// @Success 200 {object} map[string]interface{}
// @Failure 400 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /plan/:id [patch]
func (h *PlanHandler) UpdateApiPlan(c *gin.Context) {
    planID, err := strconv.Atoi(c.Param("id"))
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Plan ID"})
        return
    }

    var plan types.PlanDto
    if err := c.ShouldBindJSON(&plan); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    updatedPlan, err := h.service.UpdateApiPlan(c, planID, plan)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Error updating API Plan"})
        return
    }

    c.JSON(http.StatusOK, updatedPlan)
}

// @Summary Delete an API Plan
// @Description Deletes a specific API Plan
// @Tags API Plan Operations
// @Produce json
// @Param id path int true "Plan ID"
// @Success 200 {object} map[string]string
// @Failure 400 {object} map[string]string
// @Failure 404 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /plan/:id [delete]
func (h *PlanHandler) DeleteApiPlan(c *gin.Context) {
    planID, err := strconv.Atoi(c.Param("id"))
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Plan ID"})
        return
    }

    err = h.service.DeleteApiPlan(c, planID)
    if err != nil {
        if strings.Contains(err.Error(), "not found") {
            c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
        } else {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Error deleting API Plan"})
        }
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "API Plan deleted successfully"})
}
