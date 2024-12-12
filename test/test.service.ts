import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { RegisterUserRequest } from 'src/model/user.model';
import * as bcrypt from 'bcrypt';
import { CreateContactRequest } from 'src/model/contact.model';
import { Contact } from '@prisma/client';

@Injectable()
export class TestService {
  constructor(private readonly prismaService: PrismaService) {}

  async deleteUser(username: string) {
    await this.prismaService.user.deleteMany({
      where: {
        username,
      },
    });
  }

  async registerUser(userPaylod: RegisterUserRequest & { token?: string }) {
    userPaylod.password = await bcrypt.hash(userPaylod.password, 10);

    await this.prismaService.user.create({
      data: userPaylod,
    });
  }

  async deleteContact(username: string) {
    await this.prismaService.contact.deleteMany({
      where: {
        username,
      },
    });
  }

  async createContact(
    username: string,
    contact: CreateContactRequest,
  ): Promise<Contact> {
    return this.prismaService.contact.create({
      data: {
        ...contact,
        username,
      },
    });
  }

  async getContact(username: string): Promise<Contact> {
    return this.prismaService.contact.findFirst({
      where: {
        username,
      },
    });
  }
}
