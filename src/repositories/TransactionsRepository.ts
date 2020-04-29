import { EntityRepository, Repository, getConnection } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface Func {
  transactions: Transaction[];
  balance: Balance;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Func> {
    // const transactions = await this.find();

    const transactions = await getConnection()
      .getRepository(Transaction)
      .createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.category', 'category')
      .getMany();

    const balance = await transactions.reduce(
      (acc: Balance, transaction: Transaction) => {
        switch (transaction.type) {
          case 'income':
            acc.income += Number(transaction.value);
            break;
          case 'outcome':
            acc.outcome += Number(transaction.value);
            break;
          default:
            break;
        }
        return acc;
      },
      {
        income: 0,
        outcome: 0,
        total: 0,
      },
    );

    balance.total = balance.income - balance.outcome;
    return { transactions, balance };
  }
}

export default TransactionsRepository;
