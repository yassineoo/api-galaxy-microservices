package apiService

import (
	"context"
	"encoding/json"
	"net/http"  // Import the correct http package
	kitHttp  "github.com/go-kit/kit/transport/http"
	
)

// NewHTTPServer mounts all of the service endpoints into an http.Handler.
func NewHTTPServer(ctx context.Context, endpoints Endpoints) http.Handler {
	r := http.NewServeMux()
	
	r.Handle("/get-one", kitHttp.NewServer(
		endpoints.GetOneEndpoint,
		decodeGetOneRequest,
		encodeResponse,
	))
	r.Handle("/get-all", kitHttp.NewServer(
		endpoints.GetAllEndpoint,
		decodeGetAllRequest,
		encodeResponse,
	))
	// ... other routes
	return r
}

func decodeGetOneRequest(_ context.Context, r *http.Request) (interface{}, error) {
	var req GetOneRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	return req, err
}

func decodeGetAllRequest(_ context.Context, r *http.Request) (interface{}, error) {
	return GetAllRequest{}, nil
}

// ... other decoders

func encodeResponse(ctx context.Context, w http.ResponseWriter, response interface{}) error {
	return json.NewEncoder(w).Encode(response)
}

// ... other encoders if needed
