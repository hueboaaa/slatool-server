import { Request, Response } from 'express';
import db from '../config/lib/db';

/**
 * Render the index
 */
export const renderIndex = function (req: Request, res: Response) {
  res.status(200).json({});
};
