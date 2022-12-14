import { Injectable, NestMiddleware, NotFoundException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { PostsQueryRepository } from '../../features/posts/infrastructure/posts-query.repository';

@Injectable()
export class CheckExistingPostMiddleware implements NestMiddleware {
  constructor(private postQueryRepo: PostsQueryRepository) {}
  async use(req: Request, res: Response, next: NextFunction) {
    console.log('Middleware -->', req.params.id);
    const blog = await this.postQueryRepo.getPostById(req.params.id);
    console.log(blog);
    if (!blog) {
      console.log('Throw exception');
      throw new NotFoundException([
        { message: 'Post not exists', field: 'postId' },
      ]);
    }
    next();
  }
}
