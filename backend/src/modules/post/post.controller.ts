import { Body, Controller, Delete, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto, UpdatePostDto } from './dto/post.dto';
import { ProtectedRoute } from '../../common/decorator/protect-route.decorator';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @ProtectedRoute({
    isPublic: false,
    roles: ['SUPERADMIN'],
  })
  @Post()
  create(@Body() createPostDto: CreatePostDto, @Req() req) {
    return this.postService.create(createPostDto, req.user.id.toString()); // String ga aylantiramiz
  }

  @ProtectedRoute({
    isPublic: false,
    roles: ['SUPERADMIN'],
  })
  @Get()
  findAll() {
    return this.postService.findAll();
  }

  @ProtectedRoute({
    isPublic: false,
    roles: ['SUPERADMIN'],
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(Number(id));
  }

  @ProtectedRoute({ isPublic: false })
  @Patch(':id')
  async update(@Param('id') id: number, @Body() updatePostDto: UpdatePostDto, @Req() req) {
    const userId = req.user.id;
    return this.postService.update(Number(id), updatePostDto, userId);
  }

  @ProtectedRoute({
    isPublic: false,
    roles: ['SUPERADMIN'],
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postService.delete(Number(id));
  }

  @ProtectedRoute({
    isPublic: false,
    roles: ['SUPERADMIN'],
  })
  @Patch('archive/:id')
  archive(@Param('id') id: number) {
    return this.postService.archivePost(id);
  }
}
