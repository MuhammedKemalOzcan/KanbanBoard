// src/cards/dto/update-card.dto.ts
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateCardDto {
  @IsOptional()
  @IsNumber()
  boardId?: number;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  position?: number;
}
