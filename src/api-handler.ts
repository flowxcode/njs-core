import { NextResponse } from 'next/server';
import { query } from './db';
import logger from './logger';
import { STATUS } from './constants';

export async function apiHandler<T>(
  fn: () => Promise<T>,
  options: { useTransaction?: boolean } = {}
): Promise<NextResponse> {
  try {
    if (options.useTransaction) {
      await query('BEGIN');
      await query('SET SESSION idle_in_transaction_session_timeout = 0');
      const data = await fn();
      await query('COMMIT');
      return NextResponse.json({ data }, { status: STATUS.OK });
    }
    const data = await fn();
    return NextResponse.json({ data }, { status: STATUS.OK });
  } catch (error) {
    if (options.useTransaction) {
      await query('ROLLBACK');
    }
    logger.error('API error', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: STATUS.ERROR });
  }
}