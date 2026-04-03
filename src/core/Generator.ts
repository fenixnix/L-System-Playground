import { LSystemConfig } from '../types/lsystem';

export class LSystemGenerator {
  private config: LSystemConfig;

  constructor(config: LSystemConfig) {
    this.config = config;
  }

  generate(): string {
    let current = this.config.axiom;

    for (let i = 0; i < this.config.iterations; i++) {
      current = this.rewrite(current);
    }

    return current;
  }

  private rewrite(input: string): string {
    let output = '';
    for (const char of input) {
      if (this.config.rules[char]) {
        if (this.config.isStochastic) {
          output += this.applyStochasticRule(char);
        } else {
          output += this.config.rules[char];
        }
      } else {
        output += char;
      }
    }
    return output;
  }

  estimateLength(): number {
    const expansionFactor = this.calculateExpansionFactor();
    return Math.floor(this.config.axiom.length * Math.pow(expansionFactor, this.config.iterations));
  }

  private calculateExpansionFactor(): number {
    let total = 0;
    for (const char of this.config.axiom) {
      total += this.config.rules[char]?.length ?? 1;
    }
    return total / this.config.axiom.length || 1;
  }

  private applyStochasticRule(symbol: string): string {
    const rule = this.config.stochasticRules?.find(r => r.symbol === symbol);
    if (!rule) return symbol;

    const rand = Math.random();
    let cumulative = 0;
    for (const replacement of rule.replacements) {
      cumulative += replacement.probability;
      if (rand <= cumulative) {
        return replacement.result;
      }
    }
    return rule.replacements[rule.replacements.length - 1].result;
  }
}