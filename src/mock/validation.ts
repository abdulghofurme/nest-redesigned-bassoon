import { Provider } from '@nestjs/common';
import { ValidationService } from 'src/common/validation/validation.service';

export const mockValidationService = {
  validate: jest.fn(),
};

export const MockValidationService: Provider = {
  provide: ValidationService,
  useValue: mockValidationService,
};
