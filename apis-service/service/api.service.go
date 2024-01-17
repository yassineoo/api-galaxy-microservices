package service

import "context"

// ApiMangmentService describes the service.
type ApiMangmentService interface {
	// Add your methods heree
	// e.x: Foo(ctx context.Context,s string)(rs string, err error)
	getOne(ctx context.Context, id string) error
	getAll(ctx context.Context) error
	Create(ctx context.Context, name string) error
	Edit(ctx context.Context, email string) error
	delete(ctx context.Context, email string) error
}
