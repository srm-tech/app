export interface Agreement {
  commissionType: string;
  commissionValue: number;
  commissionCurrency: string;
  commissionLabel: string;
  agreedAt?: Date;
}
