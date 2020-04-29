import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import TransactionRepository from '../repositories/TransactionsRepository';

class DeleteTransactionService {
  public async execute(id: string): Promise<string> {
    const transactionRepository = getCustomRepository(TransactionRepository);

    const transaction = await transactionRepository.findOne({
      where: { id },
    });

    if (!transaction) {
      throw new AppError("Id doesn't exists");
    }

    await transactionRepository.delete(id);

    return `User ${id} deleted`;
  }
}

export default DeleteTransactionService;
