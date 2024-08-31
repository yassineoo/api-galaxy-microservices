package main

import (
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"local_packages/api"
	"local_packages/api/services"
	"local_packages/database"
	"log"

	//"log"
	//"os"

	"github.com/jackc/pgx/v4/pgxpool"
	gorm "gorm.io/gorm"

	"github.com/gin-gonic/gin"

	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger" // gin-swagger middleware
)

// @title API Title
// @description This is a sample server for a pet store.
// @version 1.0"os"
// @termsOfService http://terms-of-service-url.com
// @contact name Developer Support email support@email.com
// @license name Apache 2.0 url http://www.apache.org/licenses/LICENSE-2.0.html
// @host localhost:8088
// @BasePath /
// @schemes http https
func main() {

     // Create a log file
     logFile, err := os.OpenFile("service.log", os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0666)
     if err != nil {
         log.Fatalf("Failed to open log file: %v", err)
     }
     defer logFile.Close()
 
     // Set log output to the file
     log.SetOutput(logFile) 
	log.Println(" serevet starting ....")
	log.Println(" serevet starting ....")
	log.Println(" serevet starting ....")


	var gorm *gorm.DB
	var dbpool *pgxpool.Pool
	dbpool, gorm = database.InitDB()
	svc := services.NewService(dbpool, gorm)
	log.SetOutput(os.Stdout)

	router := gin.Default()
	api.SetupRoutes(router, svc)

	router.StaticFile("/koko", "./docs/swagger.json")
	router.StaticFile("/swagger/doc.json", "./docs/swagger.json")
	
    // URL to the Swagger JSON (it's generated by swag init command)
	swaggerURL := ginSwagger.URL("http://localhost:8088/swagger/doc.json")

	router.GET("/swagger-ui/*any", ginSwagger.WrapHandler(swaggerFiles.Handler, swaggerURL))
	
		
// Start the server in a separate goroutine
	port := ":9000"
	// Start the server
    // Register service with API Gateway
	serviceName := "apis-service"
	serviceVersion := "v1"
	log.Println("Starting service registration...")

	// Register the service every 15 seconds
    go func() {
        for {
            registerService(serviceName, serviceVersion, port)
            time.Sleep(40 * time.Second)
        }
    }()
	log.Println("Starting service registrationstooooop")
	
	
	//go func() {
		if err := router.Run(port); err != nil {
			log.Fatalf("Failed to run server: %v", err)
		}
	//}()

	

	// Start the cron job
	//startCronJob(svc)

	// Handle graceful shutdown
	handleShutdown(serviceName, serviceVersion, port)
}

func registerService(serviceName, serviceVersion, port string) {
   
    log.Println("Starting service registration...")
    log.Println("Starting service registration...")
    url := fmt.Sprintf("http://service-registry:3001/register/%s/%s/%s", serviceName, serviceVersion, port)
   // url := fmt.Sprintf("http://localhost:3001/register/%s/%s/%s", serviceName, serviceVersion, port)
    
    client := &http.Client{
        Timeout: 10 * time.Second, // Setting a timeout for the request
    }

    for {
        req, err := http.NewRequest(http.MethodPut, url, nil)
        if err != nil {
            log.Printf("Failed to create request: %v", err)
            time.Sleep(15 * time.Second)
            continue
        }

        resp, err := client.Do(req)
        if err != nil {
            log.Printf("Failed to register service: %v", err)
            time.Sleep(15 * time.Second)
            continue
        }
        
        defer resp.Body.Close()
        
        if resp.StatusCode == http.StatusOK {
            log.Println("Service registered successfully")
            break
        } else {
            log.Printf("Failed to register service. Status code: %d", resp.StatusCode)
        }
        
        time.Sleep(15 * time.Second)
    }
}
func unregisterService(serviceName, serviceVersion, port string) {
    
    //url := fmt.Sprintf("http://localhost:3001/unregister/%s/%s/%s", serviceName, serviceVersion, port)
    url := fmt.Sprintf("http://service-registry:3001/unregister/%s/%s/%s", serviceName, serviceVersion, port)
    // Create a new request
    req, err := http.NewRequest(http.MethodDelete, url, nil)
    if err != nil {
        log.Printf("Failed to create request for unregistering service: %v", err)
        return
    }

    // Create a new HTTP client and send the request
    client := &http.Client{}
    resp, err := client.Do(req)
    if err != nil {
        log.Printf("Failed to unregister service: %v", err)
        return
    }
    defer resp.Body.Close() // Ensure the response body is closed

    // Now you can check the StatusCode of the response
    if resp.StatusCode == http.StatusOK {
        log.Println("Service unregistered successfully")
    } else {
        // It's a good practice to handle unexpected status codes
        log.Printf("Failed to unregister service, status code: %d", resp.StatusCode)
    }
}


func handleShutdown(serviceName, serviceVersion, port string) {
	c := make(chan os.Signal, 1)
	signal.Notify(c, os.Interrupt, syscall.SIGINT, syscall.SIGTERM)
	go func() {
		<-c
		unregisterService(serviceName, serviceVersion, port)
		os.Exit(0)
	}()
}