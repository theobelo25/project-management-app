import { BadRequestException } from '@nestjs/common';
import { z } from 'zod';

import { ZodValidationPipe } from './zod-validation.pipe';
import { createZodDto } from '../zod/zod-dto.util';

describe('ZodValidationPipe', () => {
  const schema = z.object({
    email: z.string().email(),
    name: z.string().min(1),
    age: z.number().int().positive(),
  });

  class TestBodyDto extends createZodDto(schema) {}

  let pipe: ZodValidationPipe;

  beforeEach(() => {
    pipe = new ZodValidationPipe();
  });

  describe('transform', () => {
    it('returns the parsed value for a valid body', () => {
      const value = {
        email: 'test@example.com',
        name: 'Theo',
        age: 30,
      };

      const result = pipe.transform(value, {
        type: 'body',
        metatype: TestBodyDto,
        data: undefined,
      });

      expect(result).toEqual(value);
    });

    it('throws BadRequestException for an invalid body', () => {
      const value = {
        email: 'not-an-email',
        name: '',
        age: -1,
      };

      expect(() =>
        pipe.transform(value, {
          type: 'body',
          metatype: TestBodyDto,
          data: undefined,
        }),
      ).toThrow(BadRequestException);
    });

    it('returns the expected 400 error structure for an invalid body', () => {
      const value = {
        email: 'not-an-email',
        name: '',
        age: -1,
      };

      try {
        pipe.transform(value, {
          type: 'body',
          metatype: TestBodyDto,
          data: undefined,
        });
        fail('Expected transform to throw');
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);

        const response = (error as BadRequestException).getResponse();

        /* eslint-disable @typescript-eslint/no-unsafe-assignment -- jest expect.any / objectContaining */
        expect(response).toEqual({
          message: 'Validation failed',
          errors: expect.arrayContaining([
            expect.objectContaining({
              path: 'email',
              message: expect.any(String),
              code: expect.any(String),
            }),
            expect.objectContaining({
              path: 'name',
              message: expect.any(String),
              code: expect.any(String),
            }),
            expect.objectContaining({
              path: 'age',
              message: expect.any(String),
              code: expect.any(String),
            }),
          ]),
        });
        /* eslint-enable @typescript-eslint/no-unsafe-assignment */
      }
    });

    it('formats nested paths correctly', () => {
      const nestedSchema = z.object({
        user: z.object({
          profile: z.object({
            firstName: z.string().min(2),
          }),
        }),
      });

      class NestedDto extends createZodDto(nestedSchema) {}

      const value = {
        user: {
          profile: {
            firstName: '',
          },
        },
      };

      try {
        pipe.transform(value, {
          type: 'body',
          metatype: NestedDto,
          data: undefined,
        });
        fail('Expected transform to throw');
      } catch (error) {
        const response = (error as BadRequestException).getResponse() as {
          message: string;
          errors: Array<{ path: string; message: string; code: string }>;
        };

        expect(response.message).toBe('Validation failed');
        expect(response.errors).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              path: 'user.profile.firstName',
            }),
          ]),
        );
      }
    });

    it('passes through values when metatype is not a zod dto', () => {
      const value = { anything: true };

      const result = pipe.transform(value, {
        type: 'body',
        metatype: Object,
        data: undefined,
      });

      expect(result).toBe(value);
    });
  });
});
