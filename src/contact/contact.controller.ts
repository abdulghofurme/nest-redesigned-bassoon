import { Body, Controller, Post } from '@nestjs/common';
import { ContactService } from './contact.service';
import { Auth } from 'src/common/auth/auth.decorator';
import { ContactResponse, CreateContactRequest } from 'src/model/contact.model';
import { WebResponse } from 'src/model/web.model';
import { User } from '@prisma/client';

@Controller('/api/contacts')
export class ContactController {
constructor(private contactService: ContactService) {}

@Post()
async create(@Auth() user: User, @Body() request: CreateContactRequest): Promise<WebResponse<ContactResponse>> {
    const result  = await this.contactService.create(user, request)
    return {
        data: result
    }
}
}
