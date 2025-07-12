import { IsInt, IsNumber, IsString, IsIn, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserSubmissionDto {
  @ApiProperty({ description: 'User age', minimum: 18, maximum: 100 })
  @IsInt()
  @Min(18)
  @Max(100)
  age: number;

  @ApiProperty({ description: 'Annual income in USD', minimum: 0 })
  @IsNumber()
  @Min(0)
  income: number;

  @ApiProperty({ description: 'Number of dependents', minimum: 0, maximum: 10 })
  @IsInt()
  @Min(0)
  @Max(10)
  dependents: number;

  @ApiProperty({
    description: 'Risk tolerance level',
    enum: ['Low', 'Medium', 'High'],
  })
  @IsString()
  @IsIn(['Low', 'Medium', 'High'])
  riskTolerance: 'Low' | 'Medium' | 'High';
}

export class RecommendationResponseDto {
  @ApiProperty({ description: 'Recommended insurance type and amount' })
  recommendation: string;

  @ApiProperty({ description: 'Explanation for the recommendation' })
  explanation: string;
}
