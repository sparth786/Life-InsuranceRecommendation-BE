import { Controller, Post, Get, Body, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RecommendationService } from '../services/recommendation.service';
import {
  UserSubmissionDto,
  RecommendationResponseDto,
} from '../dto/user-submission.dto';

@ApiTags('recommendations')
@Controller('recommendation')
export class RecommendationController {
  constructor(private readonly recommendationService: RecommendationService) {}

  @Post()
  @ApiOperation({ summary: 'Generate life insurance recommendation' })
  @ApiResponse({
    status: 201,
    description: 'Recommendation generated successfully',
    type: RecommendationResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async generateRecommendation(
    @Body(ValidationPipe) userData: UserSubmissionDto,
  ): Promise<RecommendationResponseDto> {
    return this.recommendationService.generateRecommendation(userData);
  }

  @Get()
  @ApiOperation({ summary: 'Get all user submissions' })
  @ApiResponse({ status: 200, description: 'List of all submissions' })
  async getAllSubmissions() {
    return this.recommendationService.getAllSubmissions();
  }
}
