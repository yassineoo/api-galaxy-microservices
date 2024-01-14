package apiService

import (
	"context"

	"github.com/go-kit/kit/endpoint"
)

// Endpoints holds all Go Kit endpoints for the ApiService.
type Endpoints struct {
	GetOneEndpoint    endpoint.Endpoint
	GetAllEndpoint    endpoint.Endpoint
	CreateEndpoint    endpoint.Endpoint
	EditEndpoint      endpoint.Endpoint
	DeleteEndpoint    endpoint.Endpoint
}

// MakeEndpoints initializes all Go Kit endpoints for the ApiService.
func MakeEndpoints(s ApiService) Endpoints {
	return Endpoints{
		GetOneEndpoint:    makeGetOneEndpoint(s),
		GetAllEndpoint:    makeGetAllEndpoint(s),
		CreateEndpoint:    makeCreateEndpoint(s),
		EditEndpoint:      makeEditEndpoint(s),
		DeleteEndpoint:    makeDeleteEndpoint(s),
	}
}

func makeGetOneEndpoint(s ApiService) endpoint.Endpoint {
	return func(ctx context.Context, request interface{}) (interface{}, error) {
		req := request.(GetOneRequest)
		item, err := s.GetOne(ctx, req.ID)
		return GetOneResponse{Item: item, Err: err}, err
	}
}

func makeGetAllEndpoint(s ApiService) endpoint.Endpoint {
	return func(ctx context.Context, request interface{}) (interface{}, error) {
		items, err := s.GetAll(ctx)
		return GetAllResponse{Items: items, Err: err}, err
	}
}

func makeCreateEndpoint(s ApiService) endpoint.Endpoint {
	return func(ctx context.Context, request interface{}) (interface{}, error) {
	req := request.(CreateRequest)
	newItem, err := s.Create(ctx, req.Item)
	return CreateResponse{Item: newItem, Err: err}, err
	}
}


func makeEditEndpoint(s ApiService) endpoint.Endpoint {
return func(ctx context.Context, request interface{}) (interface{}, error) {
	req := request.(EditRequest)
	updatedItem, err := s.Edit(ctx, req.ID, req.Item)
	return EditResponse{Item: updatedItem, Err: err}, err
}
}

func makeDeleteEndpoint(s ApiService) endpoint.Endpoint {
return func(ctx context.Context, request interface{}) (interface{}, error) {
	req := request.(DeleteRequest)
	err := s.Delete(ctx, req.ID)
	return DeleteResponse{Err: err}, err
}
}

// Define request and response structs for each endpoint.

type GetOneRequest struct {
ID string
}

type GetOneResponse struct {
Item *ApiDto
Err  error
}

type GetAllRequest struct{}

type GetAllResponse struct {
Items []ApiDto
Err   error
}

type CreateRequest struct {
Item CreateApiDto
}

type CreateResponse struct {
Item *ApiDto
Err  error
}

type EditRequest struct {
ID   string
Item EditApiDto
}

type EditResponse struct {
Item *ApiDto
Err  error
}

type DeleteRequest struct {
ID string
}

type DeleteResponse struct {
Err error
}
