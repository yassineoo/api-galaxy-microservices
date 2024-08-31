package grpc

import (
	proto "local_packages/grpc/out/grpc/proto"
	"log"

	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)

var GRPC_AUTH_CLIENT proto.AuthServiceClient

func InitGrpcAuthClient() {
	connection, err := grpc.NewClient(
		"auth-service:13000",
		grpc.WithTransportCredentials(insecure.NewCredentials()),
	)

	if err != nil {
		log.Fatalf("Failed to connect: %v", err)
	}

	// defer connection.Close()

	GRPC_AUTH_CLIENT = proto.NewAuthServiceClient(connection)

	log.Println("Connected to auth service")
}
