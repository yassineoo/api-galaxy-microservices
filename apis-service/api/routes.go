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
		apisGroup.GET("/search", ApiHandler.GetSearchApis);
		apisGroup.GET("/", ApiHandler.GetAllApis);
		apisGroup.GET("/:id", ApiHandler.GetApi);
		apisGroup.GET("/user-apis/:user_id", ApiHandler.GetUserAPIs);

		// Protected
		apisGroup.PUT("/:id", ApiHandler.UpdateApi);
			apisGroup.DELETE("/:id", ApiHandler.DeleteApi);
			apisGroup.POST("/", ApiHandler.CreateApi);
	}

	// API Docs routes
	apisDocsGroup := router.Group("/apis-docs")
	{
		apisDocsGroup.GET("/:api-id", ApiDocsHandler.GetApiDocs)

		apisDocsGroup.
			POST("/", ApiDocsHandler.CreateApiDocs);
			apisDocsGroup.PATCH("/:id", ApiDocsHandler.UpdateApiDocs);
			apisDocsGroup.DELETE("/:id", ApiDocsHandler.DeleteApiDocs);

	}
	// apiLogs routes
	//apis-healthcheck
	apiLogsGroup := router.Group("/apis-logs")
	{
		apiLogsGroup.GET("/:api-id", ApiLogsHandler.GetApiLogs)

		apiLogsGroup.
			POST("/statss", ApiLogsHandler.GetLast7DaysStats);
			apiLogsGroup.POST("/stats", ApiLogsHandler.GetStatisticsByTimeFilter);

		// categoriesGroup.POST("/", CategoryHandler.CreateCategory)
		// categoriesGroup.PATCH("/:id", CategoryHandler.UpdateCategory)
		//  categoriesGroup.DELETE("/:id", CategoryHandler.DeleteCategory)
	}

	// Category routes
	categoriesGroup := router.Group("/categoriesk")
	{

		categoriesGroup.GET("/", CategoryHandler.GetAllCategories);
			categoriesGroup.POST("/", CategoryHandler.CreateCategory);
			categoriesGroup.PATCH("/:id", CategoryHandler.UpdateCategory);
			categoriesGroup.DELETE("/:id", CategoryHandler.DeleteCategory);

	}

	// Endpoints routes
	endpointsGroup := router.Group("/endpoints")
	{

		endpointsGroup.GET("/:api-id", EndpointsHandler.GetApiEndpoints)

		// Protected
		endpointsGroup.POST("/", EndpointsHandler.CreateApiEndpoints);
		endpointsGroup.POST("/multi", EndpointsHandler.CreateMultiApiEndpoints);
		endpointsGroup.PATCH("/:id", EndpointsHandler.UpdateApiEndpoints);
		endpointsGroup.DELETE("/:id", EndpointsHandler.DeleteApiEndpoints);

	}

	// Endpoints Group routes
	endpointsGroupGroup := router.Group("/endpoints-group")
	{

		endpointsGroupGroup.GET("/:api-id", EndpointsHandler.GetApiEndpointsGroups)

		// Protected
		endpointsGroupGroup.POST("/", EndpointsHandler.CreateEndpointsGroup);
		endpointsGroupGroup.PATCH("/:id", EndpointsHandler.UpdateEndpointsGroup);
		endpointsGroupGroup.DELETE("/:id", EndpointsHandler.DeleteEndpointsGroup);

	}

	// Endpoints Parameter routes
	endpointsParameterGroup := router.Group("/endpoints-parameter")
	{

		endpointsParameterGroup.GET("/:endpoint-id", EndpointsHandler.GetEndpointParameters)

		// Protected
		endpointsParameterGroup.
			
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
		
			POST("/", SubscriptionHandler.CreateApiSubscription).
			PATCH("/:subscriptionId", SubscriptionHandler.UpdateApiSubscription).
			DELETE("/:subscriptionId", SubscriptionHandler.DeleteApiSubscription)
	}

	// API Collection routes
	apiCollectionGroup := router.Group("/api-collections")
	{

		apiCollectionGroup.
			GET("/", ApiCollectionHandler.GetCollections).
			POST("/", ApiCollectionHandler.CreateCollection).
			PATCH("/:id", ApiCollectionHandler.UpdateCollection).
			DELETE("/:id", ApiCollectionHandler.DeleteCollection).
			POST("/:id/addApis", ApiCollectionHandler.AddApisToCollection).
			POST("/:id/removeApis", ApiCollectionHandler.RemoveApisFromCollection)

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
