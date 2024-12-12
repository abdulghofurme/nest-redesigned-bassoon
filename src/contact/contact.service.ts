import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { ValidationService } from 'src/common/validation/validation.service';
import { ContactResponse, CreateContactRequest } from 'src/model/contact.model';
import { ContactValidation } from './contact.validattion';
import { Contact, User } from '@prisma/client';

@Injectable()
export class ContactService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
    private validationService: ValidationService,
  ) {}

  toContactResponse(contact: Contact): ContactResponse {
    return {
      id: contact.id,
      first_name: contact.first_name,
      last_name: contact.last_name,
      email: contact.email,
      phone: contact.phone,
    };
  }

  async create(
    user: User,
    request: CreateContactRequest,
  ): Promise<ContactResponse> {
    this.logger.debug(
      `ContactService.create(${JSON.stringify(user)}, ${JSON.stringify(request)})`,
    );
    const createRequest: CreateContactRequest = this.validationService.validate(
      ContactValidation.CREATE,
      request,
    );

    const contact = await this.prismaService.contact.create({
      data: {
        ...createRequest,
        username: user.username,
      },
    });

    return this.toContactResponse(contact);
  }

  async get(user: User, contactId: number): Promise<ContactResponse> {
    const contact = await this.prismaService.contact.findFirst({
      where: { id: contactId, username: user.username },
    });

    if (!contact) {
      throw new HttpException('Contact is not found', HttpStatus.NOT_FOUND);
    }

    return this.toContactResponse(contact);
  }
}
