import { Body, Param, Query } from '@nestjs/common';
import { ZodType } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';

export function ZodBody<T>(schema: ZodType<T>): ParameterDecorator {
  return Body(new ZodValidationPipe(schema));
}

export function ZodQuery<T>(schema: ZodType<T>): ParameterDecorator {
  return Query(new ZodValidationPipe(schema));
}

export function ZodParam<T>(schema: ZodType<T>): ParameterDecorator {
  return Param(new ZodValidationPipe(schema));
}
