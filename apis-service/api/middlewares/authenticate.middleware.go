package middlewares

import (
	"context"
	"fmt"
	"net/http"
	"strings"

	"local_packages/grpc"
	proto "local_packages/grpc/out/grpc/proto" // Import your generated protobuf files

	"github.com/gin-gonic/gin"
	// Import your gRPC client package
)

// AuthMiddleware creates a middleware for authentication using gRPC
func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Extract token from the Authorization header
		authHeader := c.GetHeader("Authorization")
		fmt.Println(gin.H{"authHeader": authHeader})
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header is required"})
			c.Abort()
			return
		}

		// Extract user ID from the token
		token := strings.Replace(authHeader, "Bearer ", "", 1)
		fmt.Println(gin.H{"token": token})
		if token == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Token is required"})
			c.Abort()
			return
		}

		// Create the gRPC request
		req := &proto.AuthenticateRequest{AuthHeader: token}

		res, err := grpc.GRPC_AUTH_CLIENT.Authenticate(context.Background(), req)
		fmt.Println(gin.H{"res": res, "err": err})
		if err != nil || !res.GetValid() || res.GetUserId() == 0 {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthenticated"})
			c.Abort()
			return
		}

		// Set user ID to the context for downstream handlers
		c.Set("userId", res.GetUserId())

		// Continue to the next middleware or handler
		c.Next()
	}
}
