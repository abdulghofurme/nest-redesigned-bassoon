import { Body, Controller, Param, ParseIntPipe, Post } from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressResponse, CreateAddressRequest } from 'src/model/address.model';
import { User } from '@prisma/client';
import { WebResponse } from 'src/model/web.model';
import { Auth } from 'src/common/auth/auth.decorator';

@Controller('/api/contacts/:contactId/addresses')
export class AddressController {
  constructor(private addressService: AddressService) {}

  @Post()
  async create(
    @Auth() user: User,
    @Param('contactId', ParseIntPipe) contactId: number,
    @Body() request: CreateAddressRequest,
  ): Promise<WebResponse<AddressResponse>> {
    request.contact_id = contactId;
    const result = await this.addressService.create(user, request);

    return {
      data: result,
    };
  }
}
