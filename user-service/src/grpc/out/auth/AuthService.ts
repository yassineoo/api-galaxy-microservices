// Original file: src/grpc/proto/auth.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { AuthenticateRequest as _auth_AuthenticateRequest, AuthenticateRequest__Output as _auth_AuthenticateRequest__Output } from '../auth/AuthenticateRequest';
import type { AuthenticateResponse as _auth_AuthenticateResponse, AuthenticateResponse__Output as _auth_AuthenticateResponse__Output } from '../auth/AuthenticateResponse';

export interface AuthServiceClient extends grpc.Client {
  Authenticate(argument: _auth_AuthenticateRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_auth_AuthenticateResponse__Output>): grpc.ClientUnaryCall;
  Authenticate(argument: _auth_AuthenticateRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_auth_AuthenticateResponse__Output>): grpc.ClientUnaryCall;
  Authenticate(argument: _auth_AuthenticateRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_auth_AuthenticateResponse__Output>): grpc.ClientUnaryCall;
  Authenticate(argument: _auth_AuthenticateRequest, callback: grpc.requestCallback<_auth_AuthenticateResponse__Output>): grpc.ClientUnaryCall;
  authenticate(argument: _auth_AuthenticateRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_auth_AuthenticateResponse__Output>): grpc.ClientUnaryCall;
  authenticate(argument: _auth_AuthenticateRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_auth_AuthenticateResponse__Output>): grpc.ClientUnaryCall;
  authenticate(argument: _auth_AuthenticateRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_auth_AuthenticateResponse__Output>): grpc.ClientUnaryCall;
  authenticate(argument: _auth_AuthenticateRequest, callback: grpc.requestCallback<_auth_AuthenticateResponse__Output>): grpc.ClientUnaryCall;
  
}

export interface AuthServiceHandlers extends grpc.UntypedServiceImplementation {
  Authenticate: grpc.handleUnaryCall<_auth_AuthenticateRequest__Output, _auth_AuthenticateResponse>;
  
}

export interface AuthServiceDefinition extends grpc.ServiceDefinition {
  Authenticate: MethodDefinition<_auth_AuthenticateRequest, _auth_AuthenticateResponse, _auth_AuthenticateRequest__Output, _auth_AuthenticateResponse__Output>
}
