import { Transform } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class PostQueryDto{

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsOptional()
  public pageNumber:number = 1

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsOptional()
  public pageSize:number = 10

  @IsString()
  @IsOptional()
  public sortBy:string = "createdAt"

  @IsString()
  @IsOptional()
  public sortDirection:string = "desc"
}