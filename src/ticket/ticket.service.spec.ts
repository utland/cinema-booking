import { Test, TestingModule } from '@nestjs/testing';
import { TicketService } from './ticket.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Ticket, TicketStatus } from './entities/ticket.entity';
import { SessionService } from '../session/session.service';
import { Repository } from 'typeorm';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketStatusDto } from './dto/update-status.dto';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Session } from '../session/entities/session.entity';

describe('TicketService', () => {
  let service: TicketService;
  let ticketRepo: Repository<Ticket>;
  let sessionService: SessionService;

  const mockTicketRepo = {
    find: jest.fn(),
    save: jest.fn(),
    findBy: jest.fn(),
    findOneBy: jest.fn(),
    remove: jest.fn(),
  };

  const mockSessionService = {
    findById: jest.fn(),
  };

  const userId = 'user-1';
  const ticketId = 'ticket-1';
  const sessionId = 'session-1';
  const seatId = 'seat-1';
  const basePrice = 100;
  const startTime = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TicketService,
        {
          provide: getRepositoryToken(Ticket),
          useValue: mockTicketRepo,
        },
        {
          provide: SessionService,
          useValue: mockSessionService,
        },
      ],
    }).compile();

    service = module.get<TicketService>(TicketService);
    ticketRepo = module.get<Repository<Ticket>>(getRepositoryToken(Ticket));
    sessionService = module.get<SessionService>(SessionService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a ticket successfully when seat is not reserved', async () => {
      const createTicketDto: CreateTicketDto = {
        sessionId,
        seatId,
      };

      const session = {
        id: sessionId,
        basePrice,
        startTime,
      } as Session;

      const tickets: Ticket[] = [
        {
          id: ticketId,
          status: TicketStatus.PAID,
          seatId,
          sessionId,
        } as Ticket,
      ];

      mockSessionService.findById.mockResolvedValue(session);
      mockTicketRepo.find.mockResolvedValue(tickets);
      mockTicketRepo.save.mockResolvedValue({});

      await service.create(userId, createTicketDto);

      expect(mockSessionService.findById).toHaveBeenCalledWith(sessionId);
      expect(mockTicketRepo.find).toHaveBeenCalledWith({
        where: { seatId, sessionId },
      });
      expect(mockTicketRepo.save).toHaveBeenCalledWith({
        ...createTicketDto,
        price: 20,
        userId
      });
    });

    it('should throw ConflictException when seat is already reserved', async () => {
      const createTicketDto: CreateTicketDto = {
        sessionId,
        seatId,
      };

      const session = {
        id: sessionId,
        basePrice,
        startTime: new Date(),
      } as Session;

      const tickets: Ticket[] = [
        {
          id: ticketId,
          status: TicketStatus.RESERVED,
          seatId,
          sessionId,
        } as Ticket,
      ];

      mockSessionService.findById.mockResolvedValue(session);
      mockTicketRepo.find.mockResolvedValue(tickets);

      await expect(service.create(userId, createTicketDto)).rejects.toThrow(
        ConflictException,
      );
      expect(mockTicketRepo.save).not.toHaveBeenCalled();
    });

    it('should calculate price correctly with discount', async () => {
      const createTicketDto: CreateTicketDto = {
        sessionId,
        seatId,
      };

      const session = {
        id: sessionId,
        basePrice: 200,
        startTime: new Date(Date.now() + 15 * 60 * 1000), // 15 min from now, <30 min
      } as Session;

      const tickets: Ticket[] = [];

      mockSessionService.findById.mockResolvedValue(session);
      mockTicketRepo.find.mockResolvedValue(tickets);
      mockTicketRepo.save.mockResolvedValue({});

      await service.create(userId, createTicketDto);

      expect(mockTicketRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({
          price: 40, // 200 * 0.2
        }),
      );
    });
  });

  describe('updateStatus', () => {
    it('should update status to PAID when ticket is RESERVED', async () => {
      const updateStatusDto: UpdateTicketStatusDto = {
        ticketId,
        status: TicketStatus.PAID,
      };

      const ticket = {
        id: ticketId,
        status: TicketStatus.RESERVED,
        userId,
      } as Ticket;

      mockTicketRepo.findOneBy.mockResolvedValue(ticket);
      mockTicketRepo.save.mockResolvedValue(ticket);

      await service.updateStatus(userId, updateStatusDto);

      expect(mockTicketRepo.findOneBy).toHaveBeenCalledWith({
        id: ticketId,
      });
      expect(ticket.status).toBe(TicketStatus.PAID);
      expect(mockTicketRepo.save).toHaveBeenCalledWith(ticket);
    });

    it('should update status to CANCELLED when ticket is PAID', async () => {
      const updateStatusDto: UpdateTicketStatusDto = {
        ticketId,
        status: TicketStatus.CANCELLED,
      };

      const ticket = {
        id: ticketId,
        status: TicketStatus.PAID,
        userId,
      } as Ticket;

      mockTicketRepo.findOneBy.mockResolvedValue(ticket);
      mockTicketRepo.save.mockResolvedValue(ticket);

      await service.updateStatus(userId, updateStatusDto);

      expect(ticket.status).toBe(TicketStatus.CANCELLED);
      expect(mockTicketRepo.save).toHaveBeenCalledWith(ticket);
    });

    it('should throw ConflictException when trying to set status to RESERVED', async () => {
      const updateStatusDto: UpdateTicketStatusDto = {
        ticketId,
        status: TicketStatus.RESERVED,
      };

      await expect(service.updateStatus(userId, updateStatusDto)).rejects.toThrow(
        ConflictException,
      );
      expect(mockTicketRepo.save).not.toHaveBeenCalled();
    });

    it('should throw ConflictException when trying to set PAID on non-RESERVED ticket', async () => {
      const updateStatusDto: UpdateTicketStatusDto = {
        ticketId,
        status: TicketStatus.PAID,
      };

      const ticket = {
        id: ticketId,
        status: TicketStatus.PAID,
        userId,
      } as Ticket;

      mockTicketRepo.findOneBy.mockResolvedValue(ticket);

      await expect(service.updateStatus(userId, updateStatusDto)).rejects.toThrow(
        ConflictException,
      );
      expect(mockTicketRepo.save).not.toHaveBeenCalled();
    });

    it('should throw ConflictException when trying to set CANCELLED on non-PAID ticket', async () => {
      const updateStatusDto: UpdateTicketStatusDto = {
        ticketId,
        status: TicketStatus.CANCELLED,
      };

      const ticket = {
        id: ticketId,
        status: TicketStatus.RESERVED,
        userId,
      } as Ticket;

      mockTicketRepo.findOneBy.mockResolvedValue(ticket);

      await expect(service.updateStatus(userId, updateStatusDto)).rejects.toThrow(
        ConflictException,
      );
      expect(mockTicketRepo.save).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when ticket not found', async () => {
      const updateStatusDto: UpdateTicketStatusDto = {
        ticketId,
        status: TicketStatus.PAID,
      };

      mockTicketRepo.findOneBy.mockResolvedValue(null);

      await expect(service.updateStatus(userId, updateStatusDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('checkOwnerchip', () => {
    it('should return ticket when user is owner', async () => {
      const ticket = {
        id: ticketId,
        userId,
      } as Ticket;

      mockTicketRepo.findOneBy.mockResolvedValue(ticket);

      const result = await service.checkOwnerchip(userId, ticketId);

      expect(result).toEqual(ticket);
      expect(mockTicketRepo.findOneBy).toHaveBeenCalledWith({ id: ticketId });
    });

    it('should throw NotFoundException when ticket does not exist', async () => {
      mockTicketRepo.findOneBy.mockResolvedValue(null);

      await expect(service.checkOwnerchip(userId, ticketId)).rejects.toThrow(NotFoundException);
      expect(mockTicketRepo.findOneBy).toHaveBeenCalledWith({ id: ticketId });
    });

    it('should throw ConflictException when user is not owner', async () => {
      const ticket = {
        id: ticketId,
        userId: 'other-user',
      } as Ticket;

      mockTicketRepo.findOneBy.mockResolvedValue(ticket);

      await expect(service.checkOwnerchip(userId, ticketId)).rejects.toThrow(ConflictException);
      expect(mockTicketRepo.findOneBy).toHaveBeenCalledWith({ id: ticketId });
    });
  });
});
