import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    if (data) {
      // in case of @GetUser('name') -> return req.user.name
      return request.user[data];
    }

    return request.user;
  },
);
