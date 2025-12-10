import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact } from '../entities/contact.entity';
import { CreateContactDto } from './dto';

@Injectable()
export class ContactsService {
  constructor(
    @InjectRepository(Contact)
    private contactRepository: Repository<Contact>,
  ) {}

  async create(createContactDto: CreateContactDto): Promise<Contact> {
    const contact = this.contactRepository.create({
      name: createContactDto.name,
      email: createContactDto.email,
      subject: createContactDto.subject,
      message: createContactDto.message,
      address: createContactDto.Address, // Map Address (DTO) to address (entity)
    });
    return this.contactRepository.save(contact);
  }

  async findAll() {
    return this.contactRepository.find({
      order: { createdAt: 'DESC' },
    });
  }


  async findOne(id: string): Promise<Contact> {
    const contact = await this.contactRepository.findOne({
      where: { id },
    });

    if (!contact) {
      throw new NotFoundException(`Contact with ID ${id} not found`);
    }

    return contact;
  }

  async markAsRead(id: string): Promise<Contact> {
    const contact = await this.findOne(id);
    contact.isRead = true;
    return this.contactRepository.save(contact);
  }

  async getUnreadCount(): Promise<number> {
    return this.contactRepository.count({
      where: { isRead: false },
    });
  }
}




