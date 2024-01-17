package service

import (
	"github.com/gin-gonic/gin"
)

func SetupRoutes(router *gin.Engine, service * Service) {
    myHandler := NewMyHandler(service)

    router.GET("/", myHandler.HandleRequest)
   // router.GET("/get-all", myHandler.HandleGetAllRequest)
	
    // CRUD routes
    router.POST("/", myHandler.CreateApi)
    router.GET("/get-all", myHandler.GetAllApis)
    router.GET("/get-one/:id", myHandler.GetApi)
    router.PUT("/:id", myHandler.UpdateApi)
    router.DELETE("/:id", myHandler.DeleteApi)
    // Other routes...
}



