package api

import (
	"fmt"
	"local_packages/api/handlers"
	"local_packages/api/middlewares"
	"local_packages/api/services"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(router *gin.Engine, service *services.Service) {
	// Initialize handlers
	ApiHandler := handlers.NewApiHandler(service)
	ApiDocsHandler := handlers.NewApiDocsHandler(service)
	CategoryHandler := handlers.NewCategoryHandler(service)
	EndpointsHandler := handlers.NewEndpointsHandler(service)
	PlanHandler := handlers.NewPlanHandler(service)
	SubscriptionHandler := handlers.NewSubscriptionHandler(service)
	HealthCheckHandler := handlers.NewHealthCheckHandler(service)
	ApiCollectionHandler := handlers.NewApiCollectionHandler(service) // New handler for API collections
	ApiLogsHandler := handlers.NewLogsHandler(service)                // New handler for API collections

	// Middleware
	router.Use(CORSMiddleware())

	// Root route
	router.GET("/", ApiHandler.HandleRequest)
	router.POST("/send-request", ApiHandler.HandleSendRequest)
	router.POST("/services-test", ApiHandler.HandleHealthCheackSendRequest)
	router.POST("/services/:api-id/*path", ApiHandler.HandleSendRequest2)
	router.GET("/services/:api-id/*path", ApiHandler.HandleSendRequest2)
	router.PUT("/services/:api-id/*path", ApiHandler.HandleSendRequest2)
	router.PATCH("/services/:api-id/*path", ApiHandler.HandleSendRequest2)
	router.DELETE("/services/:api-id/*path", ApiHandler.HandleSendRequest2)



	// API routes
	apisGroup := router.Group("/apis")
	{
		apisGroup.GET("/search", ApiHandler.GetSearchApis)
		apisGroup.GET("/", ApiHandler.GetAllApis)
		apisGroup.GET("/:id", ApiHandler.GetApi)
		apisGroup.GET("/user-apis/:user_id", ApiHandler.GetUserAPIs)

		// Protected
		apisGroup.Use(middlewares.AuthMiddleware()).
			PUT("/:id", ApiHandler.UpdateApi).
			DELETE("/:id", ApiHandler.DeleteApi).
			POST("/", ApiHandler.CreateApi)
	}

	// API Docs routes
	apisDocsGroup := router.Group("/apis-docs")
	{
		apisDocsGroup.GET("/:api-id", ApiDocsHandler.GetApiDocs)

		apisDocsGroup.Use(middlewares.AuthMiddleware()).
			POST("/", ApiDocsHandler.CreateApiDocs).
			PATCH("/:id", ApiDocsHandler.UpdateApiDocs).
			DELETE("/:id", ApiDocsHandler.DeleteApiDocs)

	}
	// apiLogs routes
	//apis-healthcheck
	apiLogsGroup := router.Group("/apis-logs")
	{
		apiLogsGroup.GET("/:api-id", ApiLogsHandler.GetApiLogs)

		apiLogsGroup.
			Use(middlewares.AuthMiddleware()).
			POST("/statss", ApiLogsHandler.GetLast7DaysStats).
			POST("/stats", ApiLogsHandler.GetStatisticsByTimeFilter)

		// categoriesGroup.POST("/", CategoryHandler.CreateCategory)
		// categoriesGroup.PATCH("/:id", CategoryHandler.UpdateCategory)
		//  categoriesGroup.DELETE("/:id", CategoryHandler.DeleteCategory)
	}

	// Category routes
	categoriesGroup := router.Group("/categoriesk")
	{

		categoriesGroup.
			GET("/", CategoryHandler.GetAllCategories).
			POST("/", middlewares.AuthMiddleware(), CategoryHandler.CreateCategory).
			PATCH("/:id", middlewares.AuthMiddleware(), CategoryHandler.UpdateCategory).
			DELETE("/:id", middlewares.AuthMiddleware(), CategoryHandler.DeleteCategory)

	}

	// Endpoints routes
	endpointsGroup := router.Group("/endpoints")
	{

		endpointsGroup.GET("/:api-id", EndpointsHandler.GetApiEndpoints)

		// Protected
		endpointsGroup.
			Use(middlewares.AuthMiddleware()).
			POST("/", EndpointsHandler.CreateApiEndpoints).
			POST("/multi", EndpointsHandler.CreateMultiApiEndpoints).
			PATCH("/:id", EndpointsHandler.UpdateApiEndpoints).
			DELETE("/:id", EndpointsHandler.DeleteApiEndpoints)

	}

	// Endpoints Group routes
	endpointsGroupGroup := router.Group("/endpoints-group")
	{

		endpointsGroupGroup.GET("/:api-id", EndpointsHandler.GetApiEndpointsGroups)

		// Protected
		endpointsGroupGroup.
			Use(middlewares.AuthMiddleware()).
			POST("/", EndpointsHandler.CreateEndpointsGroup).
			PATCH("/:id", EndpointsHandler.UpdateEndpointsGroup).
			DELETE("/:id", EndpointsHandler.DeleteEndpointsGroup)

	}

	// Endpoints Parameter routes
	endpointsParameterGroup := router.Group("/endpoints-parameter")
	{

		endpointsParameterGroup.GET("/:endpoint-id", EndpointsHandler.GetEndpointParameters)

		// Protected
		endpointsParameterGroup.
			Use(middlewares.AuthMiddleware()).
			POST("/", EndpointsHandler.CreateEndpointsParameter).
			PATCH("/:id", EndpointsHandler.UpdateEndpointsParameter).
			DELETE("/:id", EndpointsHandler.DeleteEndpointsParameter)

	}

	// Health Check routes
	healthCheckGroup := router.Group("/apis-healthcheck")
	{

		healthCheckGroup.
			GET("/health-stats", HealthCheckHandler.GetApiHealthStats).
			GET("/:api-id", HealthCheckHandler.GetApiHealthCheck).
			GET("/:api-id/success-percentage", HealthCheckHandler.GetHealthCheckSuccessPercentage)
		// Protected
		healthCheckGroup.
			Use(middlewares.AuthMiddleware()).
			POST("/", HealthCheckHandler.CreateHealthCheck).
			PATCH("/:id", HealthCheckHandler.UpdateHealthCheck).
			DELETE("/:id", HealthCheckHandler.DeleteHealthCheck)

		
	}

	// Plan routes
	planGroup := router.Group("/plans")
	{
		planGroup.GET("/:api-id", PlanHandler.GetApiPlans)

		// Protected
		planGroup.
			Use(middlewares.AuthMiddleware()).
			POST("/", PlanHandler.CreateApiPlan).
			PATCH("/", PlanHandler.UpdateApiPlan).
			DELETE("/:id", PlanHandler.DeleteApiPlan)
	}

	// Subscription routes
	subscriptionsGroup := router.Group("/subscriptions")
	{
		subscriptionsGroup.GET("/", SubscriptionHandler.GetApiSubscriptions)

		// Protected
		// UPDATED by wadoud , it was GET but its for update api subscription
		subscriptionsGroup.
			Use(middlewares.AuthMiddleware()).
			POST("/", SubscriptionHandler.CreateApiSubscription).
			PATCH("/:subscriptionId", SubscriptionHandler.UpdateApiSubscription).
			DELETE("/:subscriptionId", SubscriptionHandler.DeleteApiSubscription)
	}

	// API Collection routes
	apiCollectionGroup := router.Group("/api-collections")
	{

		apiCollectionGroup.
			GET("/", ApiCollectionHandler.GetCollections).
			POST("/", middlewares.AuthMiddleware(), ApiCollectionHandler.CreateCollection).
			PATCH("/:id", middlewares.AuthMiddleware(), ApiCollectionHandler.UpdateCollection).
			DELETE("/:id", middlewares.AuthMiddleware(), ApiCollectionHandler.DeleteCollection).
			POST("/:id/addApis", middlewares.AuthMiddleware(), ApiCollectionHandler.AddApisToCollection).
			POST("/:id/removeApis", middlewares.AuthMiddleware(), ApiCollectionHandler.RemoveApisFromCollection)

	}

}

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		fmt.Println("CORS Middleware")
		// I have make a change here from 5000 to 3000
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		// c.Writer.Header().Set("Access-Control-Allow-Origin", "http://localhost:5000")

		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, PATCH, OPTIONS, GET, PUT, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}
