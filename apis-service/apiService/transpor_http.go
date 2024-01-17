package apiService

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http" // Import the correct http package
	"strconv"

	kitHttp "github.com/go-kit/kit/transport/http"
)

// NewHTTPServer mounts all of the service endpoints into an http.Handler.
func NewHTTPServer(ctx context.Context, endpoints Endpoints) http.Handler {
	r := http.NewServeMux()
	
	r.Handle("/get-one/{id}", kitHttp.NewServer(
		endpoints.GetOneEndpoint,
		decodeGetOneRequest,
		encodeResponse,
	))
	r.Handle("/get-all", kitHttp.NewServer(
		endpoints.GetAllEndpoint,
		decodeGetAllRequest,
		encodeResponse,
	))

	r.Handle("/create", kitHttp.NewServer(
        endpoints.CreateEndpoint,
        decodeCreateRequest,
        encodeResponse,
    ))
    r.Handle("/edit/{id}", kitHttp.NewServer(
        endpoints.EditEndpoint,
        decodeEditRequest,
        encodeResponse,
    ))
    r.Handle("/delete/{id}", kitHttp.NewServer(
        endpoints.DeleteEndpoint,
        decodeDeleteRequest,
        encodeResponse,
    ))
	// ... other routes
	return r
}

func decodeGetOneRequest(_ context.Context, r *http.Request) (interface{}, error) {
	if r.Method != http.MethodGet {
        return nil, fmt.Errorf("invalid method: %s", r.Method)
    }

	var req GetOneRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	return req, err
}


func parseQueryParamInt(r *http.Request, key string, defaultValue int) int {
	value := r.URL.Query().Get(key)
	if value == "" {
		return defaultValue
	}
	intValue, err := strconv.Atoi(value)
	if err != nil {
		return defaultValue
	}
	return intValue
}

func decodeGetAllRequest(_ context.Context, r *http.Request) (interface{}, error) {
	// Extract query parameters from the HTTP request and create a GetAllRequest.
	if r.Method != http.MethodGet {
        return nil, fmt.Errorf("invalid method: %s", r.Method)
    }
	req := GetAllRequest{
		Query : QueryPagination { 
		Limit: parseQueryParamInt(r, "limit", 20),   // Default to 20 if "limit" is not specified
		Page:  parseQueryParamInt(r, "page", 1)   ,  // Default to 1 if "page" is not specified
		},
	}
	return req, nil
}


func decodeCreateRequest(_ context.Context, r *http.Request) (interface{}, error) {
	if r.Method != http.MethodPost {
        return nil, fmt.Errorf("invalid method: %s", r.Method)
    }
    var req CreateRequest
    err := json.NewDecoder(r.Body).Decode(&req)
    return req, err
}

func decodeEditRequest(_ context.Context, r *http.Request) (interface{}, error) {
	if r.Method != http.MethodPatch {
        return nil, fmt.Errorf("invalid method: %s", r.Method)
    }
    var req EditRequest
    err := json.NewDecoder(r.Body).Decode(&req)
    return req, err
}

func decodeDeleteRequest(_ context.Context, r *http.Request) (interface{}, error) {
	if r.Method != http.MethodDelete {
        return nil, fmt.Errorf("invalid method: %s", r.Method)
    }
    var req DeleteRequest
    // Assuming the ID is passed as a URL parameter
    req.ID = r.URL.Query().Get("id")
    return req, nil
}



// ... other decoders

func encodeResponse(ctx context.Context, w http.ResponseWriter, response interface{}) error {
	w.Header().Set("Content-Type", "application/json")
	return json.NewEncoder(w).Encode(response)
}

// ... other encoders if needed
