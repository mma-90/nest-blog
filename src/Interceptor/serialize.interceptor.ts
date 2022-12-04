import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  UseInterceptors,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { plainToInstance } from 'class-transformer';

// todo: create Custom function decorator
interface ClassConstructor {
  new (...args: any[]);
}

export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

@Injectable()
export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: ClassConstructor) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        // if (data.length > 0) {
        //   return plainToInstance(this.dto, data[0]);
        // }
        return plainToInstance(this.dto, data);
      }),
    );
  }
}
