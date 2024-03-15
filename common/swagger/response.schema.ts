/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 */
import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { ResponseEntity } from '../entity/response.entity';

export const ApiOkResponseCustom = <
  ResponseData extends Type<unknown>,
  InnerData extends Type<unknown>,
>(
  responseData: ResponseData,
  status: number,
  innerData?: InnerData,
) => {
  const data = innerData
    ? {
        allOf: [
          { $ref: getSchemaPath(responseData) },
          {
            properties: {
              rows: {
                type: 'array',
                items: { $ref: getSchemaPath(innerData) },
              },
            },
          },
        ],
      }
    : { $ref: getSchemaPath(responseData) };

  const extraModels: any[] = [ResponseEntity, responseData];
  if (innerData) {
    extraModels.push(innerData);
  }

  return applyDecorators(
    ApiExtraModels(...extraModels),
    ApiResponse({
      status,
      schema: {
        allOf: [
          { $ref: getSchemaPath(ResponseEntity) },
          { properties: { data } },
        ],
      },
    }),
  );
};
