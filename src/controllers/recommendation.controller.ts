import {
  Controller,
  Post,
  Get,
  Body,
  ValidationPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { RecommendationService } from '../services/recommendation.service';
import {
  UserSubmissionDto,
  RecommendationResponseDto,
} from '../dto/user-submission.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@ApiTags('recommendations')
@Controller('recommendation')
export class RecommendationController {
  constructor(private readonly recommendationService: RecommendationService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Generate life insurance recommendation' })
  @ApiResponse({
    status: 201,
    description: 'Recommendation generated successfully',
    type: RecommendationResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async generateRecommendation(
    @Body(ValidationPipe) userData: UserSubmissionDto,
    @Request() req,
  ): Promise<RecommendationResponseDto> {
    return this.recommendationService.generateRecommendation(
      userData,
      req.user.id,
    );
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user submissions' })
  @ApiResponse({ status: 200, description: 'List of user submissions' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getUserSubmissions(@Request() req) {
    return this.recommendationService.getUserSubmissions(req.user.id);
  }

  @Get('history')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user recommendation history' })
  @ApiResponse({
    status: 200,
    description: 'List of user recommendation history',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getUserHistory(@Request() req) {
    return this.recommendationService.getUserSubmissions(req.user.id);
  }
}
