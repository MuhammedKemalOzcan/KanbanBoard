// src/cards/dto/update-card.dto.ts
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateCardDto {
  @IsOptional()
  @IsString()
  boardId?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  BoardId?: string;
}
