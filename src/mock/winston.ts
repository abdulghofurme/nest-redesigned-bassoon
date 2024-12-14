import { Provider } from '@nestjs/common';

export const mockWinston = {
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
};

export const MockWinston: Provider = {
  provide: 'winston',
  useValue: mockWinston,
};
