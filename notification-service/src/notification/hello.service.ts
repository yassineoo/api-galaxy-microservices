import { Injectable } from '@nestjs/common';
import { HelloRequest, HelloResponse, HelloService } from 'src/proto/hello';

@Injectable()
export class HelloServiceLoc implements HelloService {
  sayHello(request: HelloRequest): HelloResponse {
    return { message: `Hello, ${request.name}!` };
  }
}
