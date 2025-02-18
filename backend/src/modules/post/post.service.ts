import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../common';
import { CreatePostDto, UpdatePostDto } from './dto/post.dto';
import slugify from 'slugify';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreatePostDto, userId: string) {
    const baseSlug = slugify(dto.title, { lower: true, strict: true, trim: true });
    let slug = baseSlug;
    let count = 1;

    while (await this.prisma.post.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${count}`;
      count++;
    }

    return this.prisma.post.create({
      data: { ...dto, slug, authorId: Number(userId) },
    });
  }

  async findAll(page: number = 1, limit: number = 10) {
    const take = limit ? Number(limit) : undefined;
    const skip = page ? (Number(page) - 1) * Number(limit) : undefined;

    const [data, total] = await this.prisma.$transaction([
      this.prisma.post.findMany({
        where: {
          status: {
            not: 'ARCHIVED',
          },
        },
        take,
        skip,
        orderBy: { createdAt: 'desc' },
        // Yangi postlar birinchi chiqadi
      }),
      this.prisma.post.count(),
    ]);

    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      data,
    };
  }

  async findOne(id: number) {
    const post = await this.prisma.post.findUnique({
      where: {
        id,
        status: {
          not: 'ARCHIVED',
        },
      },
    });
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  async update(id: number, dto: UpdatePostDto, userId: number) {
    const existingPost = await this.prisma.post.findUnique({ where: { id } });

    if (!existingPost) {
      throw new NotFoundException('Post topilmadi');
    }

    if (existingPost.authorId !== userId) {
      throw new UnauthorizedException('Siz faqat o‘z postlaringizni yangilashingiz mumkin');
    }

    let newSlug = existingPost.slug;

    if (dto.title) {
      const baseSlug = slugify(dto.title, { lower: true, strict: true, trim: true });
      newSlug = baseSlug;

      if (baseSlug !== existingPost.slug) {
        let count = 1;
        while (await this.prisma.post.findUnique({ where: { slug: newSlug } })) {
          newSlug = `${baseSlug}-${count}`;
          count++;
        }
      }
    }

    return this.prisma.post.update({
      where: { id },
      data: { ...dto, slug: newSlug },
    });
  }

  async delete(id: number) {
    const found = await this.prisma.post.findUnique({ where: { id } });

    if (!found) {
      throw new NotFoundException('Post topilmadi');
    }
    return this.prisma.post.delete({ where: { id } });
  }

  async archivePost(id: number) {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) throw new NotFoundException('Post not found');

    return this.prisma.post.update({
      where: { id },
      data: {
        status: 'ARCHIVED',
      },
    });
  }
}
