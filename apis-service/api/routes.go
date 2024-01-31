package api

import (
	"fmt"
	"local_packages/api/handlers"

	"local_packages/api/services"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(router *gin.Engine, service *services.Service) {
    // Initialize handlers
    ApiHandler := handlers.NewApiHandler(service)
    CategoryHandler := handlers.NewCategoryHandler(service)
    EndpointsHandler := handlers.NewEndpointsHandler(service)
    PlanHandler := handlers.NewPlanHandler(service)
    SubscriptionHandler := handlers.NewSubscriptionHandler(service)
    HealthCheckHandler := handlers.NewHealthCheckHandler(service)
    ApiCollectionHandler := handlers.NewApiCollectionHandler(service) // New handler for API collections

    // Middleware
    router.Use(CORSMiddleware())

    // Root route
    router.GET("/", ApiHandler.HandleRequest)

    // API routes
    apisGroup := router.Group("/apis")
    {
        apisGroup.POST("/", ApiHandler.CreateApi)
        apisGroup.GET("/", ApiHandler.GetAllApis)
        apisGroup.GET("/:id", ApiHandler.GetApi)
        apisGroup.PUT("/:id", ApiHandler.UpdateApi)
        apisGroup.DELETE("/:id", ApiHandler.DeleteApi)
    }

    // API Docs routes
    apisDocsGroup := router.Group("/apis-docs")
    {
        apisDocsGroup.POST("/", ApiHandler.CreateApi)
        apisDocsGroup.GET("/:api-id", ApiHandler.GetApi)
        apisDocsGroup.PATCH("/:id", ApiHandler.UpdateApi)
        apisDocsGroup.DELETE("/:id", ApiHandler.DeleteApi)
    }

    // Category routes
    categoriesGroup := router.Group("/categories")
    {
        categoriesGroup.POST("/", CategoryHandler.CreateCategory)
        categoriesGroup.GET("/", CategoryHandler.GetAllCategories)
        categoriesGroup.PATCH("/:id", CategoryHandler.UpdateCategory)
        categoriesGroup.DELETE("/:id", CategoryHandler.DeleteCategory)
    }

    // Endpoints routes
    endpointsGroup := router.Group("/endpoints")
    {
        endpointsGroup.POST("/", EndpointsHandler.CreateApiEndpoints)
        endpointsGroup.GET("/:api-id", EndpointsHandler.GetApiEndpoints)
        endpointsGroup.PATCH("/:id", EndpointsHandler.UpdateApiEndpoints)
        endpointsGroup.DELETE("/:id", EndpointsHandler.DeleteApiEndpoints)
    }

    // Endpoints Group routes
    endpointsGroupGroup := router.Group("/endpoints-group")
    {
        endpointsGroupGroup.POST("/", EndpointsHandler.CreateEndpointsGroup)
        endpointsGroupGroup.GET("/:api-id", EndpointsHandler.GetApiEndpointsGroups)
        endpointsGroupGroup.PATCH("/:id", EndpointsHandler.UpdateEndpointsGroup)
        endpointsGroupGroup.DELETE("/:id", EndpointsHandler.DeleteEndpointsGroup)
    }

    // Endpoints Parameter routes
    endpointsParameterGroup := router.Group("/endpoints-parameter")
    {
        endpointsParameterGroup.POST("/", EndpointsHandler.CreateEndpointsParameter)
        endpointsParameterGroup.GET("/:api-id", EndpointsHandler.GetEndpointParameters)
        endpointsParameterGroup.PATCH("/:id", EndpointsHandler.UpdateEndpointsParameter)
        endpointsParameterGroup.DELETE("/:id", EndpointsHandler.DeleteEndpointsParameter)
    }

    // Health Check routes
    healthCheckGroup := router.Group("/health-checks")
    {
        healthCheckGroup.POST("/", HealthCheckHandler.CreateHealthCheck)
        healthCheckGroup.GET("/:api-id", HealthCheckHandler.GetHealthCheck)
        healthCheckGroup.PATCH("/:id", HealthCheckHandler.UpdateHealthCheck)
        healthCheckGroup.DELETE("/:id", HealthCheckHandler.DeleteHealthCheck)
        healthCheckGroup.GET("/:api-id/success-percentage", HealthCheckHandler.GetHealthCheckSuccessPercentage)
    }

    // Plan routes
    planGroup := router.Group("/plans")
    {
        planGroup.POST("/", PlanHandler.CreateApiPlan)
        planGroup.GET("/:api-id", PlanHandler.GetApiPlans)
        planGroup.PATCH("/:id", PlanHandler.UpdateApiPlan)
        planGroup.DELETE("/:id", PlanHandler.DeleteApiPlan)
    }

    // Subscription routes
    subscriptionsGroup := router.Group("/subscriptions")
    {
        subscriptionsGroup.GET("/", SubscriptionHandler.GetApiSubscriptions)
        subscriptionsGroup.POST("/", SubscriptionHandler.CreateApiSubscription)
        subscriptionsGroup.GET("/:subscriptionId", SubscriptionHandler.UpdateApiSubscription)
        subscriptionsGroup.DELETE("/:subscriptionId", SubscriptionHandler.DeleteApiSubscription)
    }

    // API Collection routes
    apiCollectionGroup := router.Group("/api-collections")
    {
        apiCollectionGroup.POST("/", ApiCollectionHandler.CreateCollection)
        apiCollectionGroup.GET("/", ApiCollectionHandler.GetCollections)
        apiCollectionGroup.PATCH("/:id", ApiCollectionHandler.UpdateCollection)
        apiCollectionGroup.DELETE("/:id", ApiCollectionHandler.DeleteCollection)
        apiCollectionGroup.POST("/:id/addApis", ApiCollectionHandler.AddApisToCollection)
        apiCollectionGroup.POST("/:id/removeApis", ApiCollectionHandler.RemoveApisFromCollection)
    }
}



func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		fmt.Println("CORS Middleware");
		c.Writer.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")

//		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}
