import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Address, User } from '@prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { ValidationService } from 'src/common/validation/validation.service';
import { ContactService } from 'src/contact/contact.service';
import {
  AddressResponse,
  CreateAddressRequest,
  GetAddressRequest,
} from 'src/model/address.model';
import { AddressValidation } from './address.validation';

@Injectable()
export class AddressService {
  constructor(
    private prismaService: PrismaService,
    private validationService: ValidationService,
    private contactService: ContactService,
  ) {}

  toAddressResponse(address: Address) {
    return {
      id: address.id,
      country: address.country,
      postal_code: address.postal_code,
      city: address.city,
      province: address.province,
      street: address.street,
    };
  }

  async create(
    user: User,
    request: CreateAddressRequest,
  ): Promise<AddressResponse> {
    const createRequest: CreateAddressRequest = this.validationService.validate(
      AddressValidation.CREATE,
      request,
    );

    await this.contactService.checkContactExists(
      user.username,
      createRequest.contact_id,
    );

    const address = await this.prismaService.address.create({
      data: createRequest,
    });

    return this.toAddressResponse(address);
  }

  async get(user: User, request: GetAddressRequest): Promise<AddressResponse> {
    await this.contactService.checkContactExists(
      user.username,
      request.contact_id,
    );

    const address = await this.prismaService.address.findFirst({
      where: {
        id: request.address_id,
        contact_id: request.contact_id,
      },
    });

    if (!address) {
      throw new HttpException('Address not found', HttpStatus.NOT_FOUND);
    }

    return this.toAddressResponse(address);
  }
}
