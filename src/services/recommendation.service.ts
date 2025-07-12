import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import {
  UserSubmissionDto,
  RecommendationResponseDto,
} from '../dto/user-submission.dto';

@Injectable()
export class RecommendationService {
  constructor(private prisma: PrismaService) {}

  async generateRecommendation(
    userData: UserSubmissionDto,
    userId?: string,
  ): Promise<RecommendationResponseDto> {
    const { age, income, dependents, riskTolerance } = userData;

    // Calculate recommended coverage amount (typically 10-15x annual income)
    const baseCoverage = income * 12; // Monthly income to annual
    const coverageMultiplier = this.getCoverageMultiplier(
      age,
      dependents,
      riskTolerance,
    );
    const recommendedAmount =
      Math.round((baseCoverage * coverageMultiplier) / 1000) * 1000; // Round to nearest 1000

    // Determine insurance type based on age and risk tolerance
    const insuranceType = this.getInsuranceType(age, riskTolerance);
    const termLength = this.getTermLength(age, dependents);

    const recommendation = `${insuranceType} – $${recommendedAmount.toLocaleString()} for ${termLength} years`;
    const explanation = this.generateExplanation(
      age,
      income,
      dependents,
      riskTolerance,
      insuranceType,
      recommendedAmount,
      termLength,
    );

    // Store the submission in database
    await this.prisma.userSubmission.create({
      data: {
        age,
        income,
        dependents,
        riskTolerance,
        recommendation,
        explanation,
        userId,
      },
    });

    return { recommendation, explanation };
  }

  private getCoverageMultiplier(
    age: number,
    dependents: number,
    riskTolerance: string,
  ): number {
    let multiplier = 10; // Base multiplier

    // Adjust based on age
    if (age < 30) multiplier += 2;
    else if (age < 50) multiplier += 1;
    else multiplier -= 1;

    // Adjust based on dependents
    multiplier += dependents * 0.5;

    // Adjust based on risk tolerance
    switch (riskTolerance) {
      case 'Low':
        multiplier += 1;
        break;
      case 'High':
        multiplier += 2;
        break;
    }

    return Math.min(multiplier, 20); // Cap at 20x
  }

  private getInsuranceType(age: number, riskTolerance: string): string {
    if (age < 40) {
      return 'Term Life';
    } else if (age < 60) {
      return riskTolerance === 'High' ? 'Whole Life' : 'Term Life';
    } else {
      return 'Whole Life';
    }
  }

  private getTermLength(age: number, dependents: number): number {
    if (dependents > 0) {
      // If they have dependents, recommend coverage until youngest child is 25
      const yearsUntilYoungestChild25 = Math.max(25 - (age - 25), 10);
      return Math.min(yearsUntilYoungestChild25, 30);
    } else {
      // For people without dependents, shorter term
      return Math.min(65 - age, 20);
    }
  }

  private generateExplanation(
    age: number,
    income: number,
    dependents: number,
    riskTolerance: string,
    insuranceType: string,
    amount: number,
    termLength: number,
  ): string {
    const explanations: string[] = [];

    explanations.push(
      `Based on your age of ${age}, we recommend ${insuranceType} insurance.`,
    );

    if (dependents > 0) {
      explanations.push(
        `With ${dependents} dependent${dependents > 1 ? 's' : ''}, you need sufficient coverage to protect your family's financial future.`,
      );
    }

    explanations.push(
      `Your annual income of $${income.toLocaleString()} suggests a coverage amount of $${amount.toLocaleString()}.`,
    );

    if (riskTolerance === 'High') {
      explanations.push(
        'Given your high risk tolerance, we recommend a more comprehensive policy.',
      );
    } else if (riskTolerance === 'Low') {
      explanations.push(
        'With your low risk tolerance, we suggest a conservative but adequate coverage level.',
      );
    }

    explanations.push(
      `This ${termLength}-year policy will provide financial security for your loved ones.`,
    );

    return explanations.join(' ');
  }

  async getAllSubmissions() {
    return this.prisma.userSubmission.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async getUserSubmissions(userId: string) {
    return this.prisma.userSubmission.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
