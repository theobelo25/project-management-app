import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { ZodError, ZodType } from 'zod';
import { isZodDto } from '@repo/types';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  transform(value: unknown, metadata: ArgumentMetadata) {
    const schema = this.getSchema(metadata);

    if (!schema) {
      return value;
    }

    try {
      return schema.parse(value);
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        throw new BadRequestException({
          message: 'Validation failed',
          errors: error.issues.map((issue) => ({
            path: issue.path.join('.'),
            message: issue.message,
            code: issue.code,
          })),
        });
      }

      throw new BadRequestException('Validation failed');
    }
  }

  private getSchema(metadata: ArgumentMetadata): ZodType<object> | null {
    const { metatype, type } = metadata;

    if (!metatype) {
      return null;
    }

    if (type !== 'body' && type !== 'query' && type !== 'param') {
      return null;
    }

    if (!isZodDto(metatype)) {
      return null;
    }

    return metatype.schema;
  }
}
