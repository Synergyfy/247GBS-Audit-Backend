import { BaseCalculator, CalculationResult } from './base.calculator';
import { HospitalityCalculator } from './hospitality.calculator';

class DefaultCalculator extends BaseCalculator {
  calculate(answers: Record<string, any>): CalculationResult {
    // Basic fallback logic
    const capacityDrainPct = 0;
    const totalStockImpact = 0;
    const annualRecovery = 0;
    return {
      capacityDrainPct,
      totalStockImpact,
      annualRecovery,
      impactScore: 0
    };
  }
}

export class CalculationFactory {
  private static calculators: Record<string, BaseCalculator> = {
    'hospitality-food': new HospitalityCalculator(),
    // Add other sectors here: 'retail-wholesale': new RetailCalculator(), etc.
  };

  static getCalculator(sectorId: string): BaseCalculator {
    return this.calculators[sectorId] || new DefaultCalculator();
  }
}
