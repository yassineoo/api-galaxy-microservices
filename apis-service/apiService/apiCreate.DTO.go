package apiService
// ItemDTO represents the data transfer object for an item.
type ApiDto struct {
    ID    string
    Name  string
    // other fields...
}

// CreateApiDto represents the data needed to create a new Api.
type CreateApiDto struct {
    Name  string
    // other fields...
}

// EditApiDto represents the data needed to edit an existing Api.
type EditApiDto struct {
    Name  string
    // other fields...
}
