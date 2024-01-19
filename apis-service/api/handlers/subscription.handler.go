package handlers

import (
	"net/http"
	"strconv"
	"strings"

	"local_packages/api/services"
	"local_packages/api/types"

	"github.com/gin-gonic/gin"
)

type SubscriptionHandler struct {
    service *services.Service
}

func NewSubscriptionHandler(s *services.Service) *SubscriptionHandler {
    return &SubscriptionHandler{service: s}
}

// @Summary Create an API Subscription
// @Description Creates a new API Subscription
// @Tags API Subscription Operations
// @Accept json
// @Produce json
// @Param Subscription body types.createSubscriptionDto true "API Subscription Data"
// @Success 201 {object} map[string]interface{}
// @Failure 400 {object} map[string]string
// @Router /Subscription [post]
func (h *SubscriptionHandler) CreateApiSubscription(c *gin.Context) {
    var Subscription types.CreateSubscriptionDto
    if err := c.ShouldBindJSON(&Subscription); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    result, err := h.service.CreateApiSubscription(c, Subscription)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Error creating API Subscription"})
        return
    }

    c.JSON(http.StatusCreated, result)
}

// @Summary Get API Subscriptions by API ID
// @Description Retrieves Subscriptions for a specific API
// @Tags API Subscription Operations
// @Produce json
// @Param api-id path int true "API ID"
// @Success 200 {object} map[string]interface{}
// @Failure 400 {object} map[string]string
// @Router /Subscription/:api-id [get]
func (h *SubscriptionHandler) GetApiSubscriptions(c *gin.Context) {
    apiID, err := strconv.Atoi(c.Param("api-id"))
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid API ID"})
        return
    }

    Subscriptions, err := h.service.GetApiSubscriptions(c, apiID)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Error fetching API Subscriptions"})
        return
    }

    c.JSON(http.StatusOK, Subscriptions)
}

// @Summary Update an API Subscription
// @Description Updates an existing API Subscription
// @Tags API Subscription Operations
// @Accept json
// @Produce json
// @Param id path int true "Subscription ID"
// @Param Subscription body types.CreateSubscriptionDto true "API Subscription Data"
// @Success 200 {object} map[string]interface{}
// @Failure 400 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /Subscription/:id [patch]
func (h *SubscriptionHandler) UpdateApiSubscription(c *gin.Context) {
    SubscriptionID, err := strconv.Atoi(c.Param("id"))
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Subscription ID"})
        return
    }

    var Subscription types.CreateSubscriptionDto
    if err := c.ShouldBindJSON(&Subscription); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    updatedSubscription, err := h.service.UpdateApiSubscription(c, SubscriptionID, Subscription)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Error updating API Subscription"})
        return
    }

    c.JSON(http.StatusOK, updatedSubscription)
}

// @Summary Delete an API Subscription
// @Description Deletes a specific API Subscription
// @Tags API Subscription Operations
// @Produce json
// @Param id path int true "Subscription ID"
// @Success 200 {object} map[string]string
// @Failure 400 {object} map[string]string
// @Failure 404 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /Subscription/:id [delete]
func (h *SubscriptionHandler) DeleteApiSubscription(c *gin.Context) {
    SubscriptionID, err := strconv.Atoi(c.Param("id"))
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Subscription ID"})
        return
    }

    err = h.service.DeleteApiSubscription(c, SubscriptionID)
    if err != nil {
        if strings.Contains(err.Error(), "not found") {
            c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
        } else {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Error deleting API Subscription"})
        }
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "API Subscription deleted successfully"})
}
