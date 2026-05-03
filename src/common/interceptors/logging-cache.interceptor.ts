import { CallHandler, ExecutionContext, Injectable } from '@nestjs/common';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingCacheInterceptor extends CacheInterceptor {
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<unknown>> {
    const req = context.switchToHttp().getRequest<{ url: string }>();
    const key = this.trackBy(context);
    const cachedValue = key ? await this.cacheManager.get(key) : undefined;

    if (cachedValue) {
      console.log(`[CACHE HIT]  ${req.url} — resposta servida da memória`);
    } else {
      console.log(`[CACHE MISS] ${req.url} — buscando no banco de dados...`);
    }

    return super.intercept(context, next).then((obs) =>
      obs.pipe(
        tap(() => {
          if (!cachedValue) {
            console.log(`[CACHE SET]  ${req.url} — resposta armazenada em cache`);
          }
        }),
      ),
    );
  }
}
