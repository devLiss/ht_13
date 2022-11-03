import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { BlogQueryRepository } from '../infrastructure/blog-query.repository';
import { BlogService } from '../application/blog.service';
import { BlogQueryDto } from '../dto/blogQuery.dto';
import { CreateBlogDto } from '../dto/createBlog.dto';
import { PostsService } from '../../posts/application/posts.service';
import { PostsQueryRepository } from '../../posts/infrastructure/posts-query.repository';
import { CreatePostByIdDto } from '../dto/createPostById.dto';

@Controller('blogs')
export class BlogsController {
  constructor(
    protected blogsService: BlogService,
    protected blogQueryRepo: BlogQueryRepository,
    private postCUService: PostsService,
    private postsQueryRepo: PostsQueryRepository,
  ) {}

  @Post()
  async createBlog(@Body() cbDto: CreateBlogDto) {
    return await this.blogsService.createBlog(cbDto.name, cbDto.youtubeUrl);
  }

  @Get()
  async getAllBlogs(@Query() bqDto: BlogQueryDto) {
    const data = await this.blogQueryRepo.findAllBlogs(
      bqDto.searchNameTerm,
      bqDto.pageNumber,
      bqDto.pageSize,
      bqDto.sortBy,
      bqDto.sortDirection,
    );
    return data;
  }

  @Get('/:blogId/posts')
  async getAllPostsByBlogId(
    @Param() blogId: string,
    @Query() bqDto: BlogQueryDto,
  ) {
    return await this.postsQueryRepo.getPostsByBlogId(
      '',
      blogId,
      bqDto.pageNumber,
      bqDto.pageSize,
      bqDto.sortBy,
      bqDto.sortDirection,
    );
  }

  @Post('/:blogId/posts')
  async createPostByBlogId(
    @Param('blogId') blogId: string,
    @Body() cpDto: CreatePostByIdDto,
  ) {
    console.log('fdsfds' + blogId);
    const blog = await this.blogQueryRepo.findBlogById(blogId);
    if (!blog) throw new NotFoundException();

    const post = await this.postCUService.createPost(
      cpDto.title,
      cpDto.shortDescription,
      cpDto.content,
      blogId,
      blogId,
    );
    return post;
  }

  @Get('/:id')
  async getBlogById(@Param('id') id: string) {
    return await this.blogQueryRepo.findBlogById(id);
  }

  @Put('/:id')
  async updateBlog(@Param('id') id: string, @Body() cbDto: CreateBlogDto) {
    await this.blogsService.updateBlog(id, cbDto.name, cbDto.youtubeUrl);
  }

  @Delete('/:id')
  async deleteBlog(@Param('id') id: string) {
    await this.blogsService.deleteBlog(id);
  }
}
