import { ApiProperty } from '@nestjs/swagger';

export default class ListDto {
  @ApiProperty({
    required: false,
    description: 'Ejemplo: {"orderBy": "name", "orderType": "ASC"}',
  })
  'filter[order]'?: string;

  @ApiProperty({
    required: false,
  })
  'filter[limit]'?: string;

  @ApiProperty({
    required: false,
  })
  'filter[skip]'?: string;

  @ApiProperty({
    required: false,
    description:
      'Ejemplo: [{"field":"status","operator":"==","value":"ACTIVE"}]',
  })
  'filter[where]'?: string;
}
