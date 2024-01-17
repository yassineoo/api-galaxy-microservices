package api

import (
	"github.com/gin-gonic/gin"
)

func SetupRoutes(router *gin.Engine, service *Service) {
	myHandler := NewMyHandler(service)

	router.GET("/", myHandler.HandleRequest)
	// router.GET("/get-all", myHandler.HandleGetAllRequest)

	// api CRUD routes
	router.POST("/", myHandler.CreateApi)
	router.GET("/get-all", myHandler.GetAllApis)
	router.GET("/get-one/:id", myHandler.GetApi)
	router.PATCH("/:id", myHandler.UpdateApi)
	router.DELETE("/:id", myHandler.DeleteApi)
	// Other routes...

		// CRUD routes
		router.POST("/categories/", myHandler.CreateCategory)
		router.GET("/categories/get-all", myHandler.GetAllCategories)
		//router.GET("/categoriesget-one/:id", myHandler.GetApi)
		router.PATCH("/categories/:id", myHandler.UpdateCategory)
		router.DELETE("/categories/:id", myHandler.DeleteCategory)
}
