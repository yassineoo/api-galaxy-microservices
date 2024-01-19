package api

import (
	"local_packages/api/handlers"

	"local_packages/api/services"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(router *gin.Engine, service *services.Service) {
	ApiHandler := handlers.NewApiHandler(service)
	CategoryHandler := handlers.NewCategoryHandler(service)
	PlanHandler := handlers.NewPlanHandler(service)
	SubscriptionHandler := handlers.NewSubscriptionHandler(service)


	router.GET("/", ApiHandler.HandleRequest)
	router.Use(CORSMiddleware())
	// router.GET("/get-all", myHandler.HandleGetAllRequest)


	// Grouping under "/apis/"
	apisGroup := router.Group("/apis")

	// API CRUD routes
	apisGroup.POST("/", ApiHandler.CreateApi)
	apisGroup.GET("/", ApiHandler.GetAllApis)
	apisGroup.GET("/:id", ApiHandler.GetApi)
	apisGroup.PATCH("/:id", ApiHandler.UpdateApi)
	apisGroup.DELETE("/:id", ApiHandler.DeleteApi)

	// CRUD routes for categories under "/apis/"
	categoriesGroup := apisGroup.Group("/categories")
	categoriesGroup.POST("/", CategoryHandler.CreateCategory)
	categoriesGroup.GET("/", CategoryHandler.GetAllCategories)
	//categoriesGroup.GET("/get-one/:id", CategoryHandler.GetApi) // Uncomment if needed
	categoriesGroup.PATCH("/:id", CategoryHandler.UpdateCategory)
	categoriesGroup.DELETE("/:id", CategoryHandler.DeleteCategory)


	//

	subscriptionsGroup := router.Group("/subscriptions")

	// Api plan for an Api 
	plan := subscriptionsGroup.Group("/plan")
	plan.POST("/", PlanHandler.CreateApiPlan)
	plan.GET("/:api-id", PlanHandler.GetApiPlans)
	plan.PATCH("/:id", PlanHandler.UpdateApiPlan)
	plan.DELETE("/:id", PlanHandler.DeleteApiPlan)

	subscriptionsGroup.GET("/", SubscriptionHandler.GetApiSubscriptions)
	subscriptionsGroup.POST("/", SubscriptionHandler.CreateApiSubscription)
	subscriptionsGroup.GET("/:subscriptionId", SubscriptionHandler.UpdateApiSubscription)
	subscriptionsGroup.DELETE("/:subscriptionId", SubscriptionHandler.DeleteApiSubscription	)


}


func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
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
