import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import type { RequestUser } from '../common/types/request-user.type';
import { SupportService } from './support.service';
import { CreateTicketDto, CreateReplyDto } from './dto/support.dto';

@Controller('support')
@UseGuards(JwtAuthGuard)
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @Post('tickets')
  async createTicket(
    @CurrentUser() user: RequestUser,
    @Body() dto: CreateTicketDto,
  ) {
    return this.supportService.createTicket(user.sub, dto);
  }

  @Get('tickets')
  async getMyTickets(
    @CurrentUser() user: RequestUser,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.supportService.getUserTickets(
      user.sub,
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 10,
    );
  }

  @Get('tickets/:id')
  async getTicket(@CurrentUser() user: RequestUser, @Param('id') id: string) {
    const ticket = await this.supportService.getTicketById(id, user.sub);
    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }
    return ticket;
  }

  @Post('tickets/:id/reply')
  async addReply(
    @CurrentUser() user: RequestUser,
    @Param('id') ticketId: string,
    @Body() dto: CreateReplyDto,
  ) {
    return this.supportService.addReply(ticketId, user.sub, dto);
  }

  @Patch('tickets/:id/close')
  async closeTicket(
    @CurrentUser() user: RequestUser,
    @Param('id') ticketId: string,
  ) {
    return this.supportService.closeTicket(ticketId, user.sub);
  }
}
