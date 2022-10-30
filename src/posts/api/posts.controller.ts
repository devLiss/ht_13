import {
    Body,
    Controller,
    Delete,
    Get,
    HttpException,
    NotFoundException,
    Param,
    Post,
    Put,
    Query
} from "@nestjs/common";
import { PostsService } from "../application/posts.service";
import { PostQueryDto } from "../dto/postQuery.dto";
import { PostsQueryRepository } from "../infrastructure/posts-query.repository";
import { CreatePostDto } from "../dto/createPost.dto";

@Controller('posts')
export class PostsController {

    constructor(protected postService:PostsService,
                protected  postQueryRepo:PostsQueryRepository) {

    }
    @Get(':postId/comments')
    getCommentByPostId() {
    }

    @Get()
    async getAllPosts(@Query() pqDto:PostQueryDto) {
        /*if(req.headers.authorization) {
            const token = req.headers.authorization.split(' ')[1]
            console.log(token)
            const userId = await this.jwtService.getUserByAccessToken(token);
            console.log("UserId = " + userId)

            if(userId){
                const user = await this.userService.getUserById(userId.toString());
                if(user){currentUserId = user.id}
            }
        }*/
        const currentUserId = ""
        const data = await this.postQueryRepo.findAllPosts(currentUserId,pqDto.pageNumber, pqDto.pageSize, pqDto.sortBy, pqDto.sortDirection);
        return data;
    }

    @Post()
    async createPost(@Body() cpDto:CreatePostDto){
        console.log(cpDto)
        const post = await this.postService.createPost(cpDto.title,
          cpDto.shortDescription,
          cpDto.content,
          cpDto.blogId,
          cpDto.blogId);

        if(!post)
            throw new NotFoundException()

        return post
    }

    @Get(':id')
    async getPostById(@Param('id') id:string){
        return await this.postQueryRepo.findPostById(id,"");
    }

    @Put(':id')
    async updatePost(@Param('id') id:string,@Body() cpDto:CreatePostDto){
        const isUpdated = await this.postService.updatePost(id, cpDto.title, cpDto.content, cpDto.shortDescription, cpDto.blogId)
        if(!isUpdated)
            throw new NotFoundException()

        return true
    }

    @Delete(':id')
    async deletePost(@Param('id') id:string){
        const isDeleted = await this.postService.deletePost(id);
        if(!isDeleted)
            throw new NotFoundException();

        return true
    }
}


