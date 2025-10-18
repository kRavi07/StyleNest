/* eslint-disable no-unused-vars */
import { NextRequest, NextFetchEvent, NextResponse } from "next/server";

export type MiddlewareFn = (
  req: NextRequest,
  event: NextFetchEvent,
  next: () => Promise<NextResponse>
) => Promise<NextResponse>;

export function createMiddlewareRunner(middlewares: MiddlewareFn[]) {
  return async function run(
    req: NextRequest,
    event: NextFetchEvent
  ): Promise<NextResponse> {
    let index = -1;

    async function dispatch(i: number): Promise<NextResponse> {
      if (i <= index) throw new Error("next() called multiple times");
      index = i;
      const fn = middlewares[i];
      if (fn) {
        return fn(req, event, () => dispatch(i + 1));
      }
      return NextResponse.next();
    }

    return dispatch(0);
  };
}
