import { Type } from 'class-transformer';
import { IsString, ValidateNested } from 'class-validator';
import { CreateCardDto } from 'src/cards/create-card.dto';

export class CreateBoardDto {
  @IsString()
  title: string;

  @ValidateNested({ each: true }) //Card dizisindeki elemanlar geçerli bir CreateCardDto yapısında mı diye kontrol eder.
  @Type(() => CreateCardDto) //Gelen JSON verisini CreateCardDto sınıfına dönüştürür.
  cards: CreateCardDto[]; 
}
