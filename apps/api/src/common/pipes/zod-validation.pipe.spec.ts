import { BadRequestException } from '@nestjs/common';
import { z } from 'zod';

import { ZodValidationPipe } from './zod-validation.pipe';

describe('ZodValidationPipe', () => {
  const schema = z.object({
    email: z.email(),
    name: z.string().min(1),
    age: z.number().int().positive(),
  });

  let pipe: ZodValidationPipe<{
    email: string;
    name: string;
    age: number;
  }>;

  beforeEach(() => {
    pipe = new ZodValidationPipe(schema);
  });

  describe('transform', () => {
    it('returns the parsed value for a valid body', () => {
      const value = {
        email: 'test@example.com',
        name: 'Theo',
        age: 30,
      };

      const result = pipe.transform(value);

      expect(result).toEqual(value);
    });

    it('throws BadRequestException for an invalid body', () => {
      const value = {
        email: 'not-an-email',
        name: '',
        age: -1,
      };

      expect(() => pipe.transform(value)).toThrow(BadRequestException);
    });

    it('returns the expected 400 error structure for an invalid body', () => {
      const value = {
        email: 'not-an-email',
        name: '',
        age: -1,
      };

      try {
        pipe.transform(value);
        fail('Expected transform to throw');
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);

        const response = (error as BadRequestException).getResponse();

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

      const nestedPipe = new ZodValidationPipe(nestedSchema);

      const value = {
        user: {
          profile: {
            firstName: '',
          },
        },
      };

      try {
        nestedPipe.transform(value);
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
  });
});
