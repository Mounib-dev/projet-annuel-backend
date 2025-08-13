

import { createBalance } from '../controllers/balance/balance';
import { retrieeBalance } from '../controllers/balance/balance';
import { Balance } from '../models/Balance';
import { generateInternalServerErrorMessage } from '../helpers/generateErrorResponse';

jest.mock('../models/Balance');
jest.mock('../helpers/generateErrorResponse');

describe('createBalance', () => {
  let req: any;
  let res: any;
  let next: any;

  beforeEach(() => {
    req = {
      body: {
        user: { id: 'user123' },
        amount: 100,
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();
    jest.clearAllMocks();
  });

  it('crée un nouveau balance et renvoie 201', async () => {
    const saveMock = jest.fn().mockResolvedValue(undefined);
    (Balance as unknown as jest.Mock).mockImplementation(() => ({
      save: saveMock,
      amount: req.body.amount,
      user: req.body.user.id,
    }));

    await createBalance(req, res, next);

    expect(Balance).toHaveBeenCalledWith({
      amount: 100,
      user: 'user123',
    });
    expect(saveMock).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expect.stringContaining('New balance created'),
      })
    );
  });

  it('renvoie 500 en cas d’erreur', async () => {
    const saveMock = jest.fn().mockRejectedValue(new Error('DB error'));
    (Balance as unknown as jest.Mock).mockImplementation(() => ({
      save: saveMock,
    }));
    (generateInternalServerErrorMessage as jest.Mock).mockReturnValue({
      error: 'Internal Server Error',
    });

    await createBalance(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    expect(generateInternalServerErrorMessage).toHaveBeenCalled();
  });
});



describe('retrieeBalance', () => {
  let req: any;
  let res: any;
  let next: any;

  beforeEach(() => {
    req = {
      body: {
        user: { id: 'user123' },
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();
    jest.clearAllMocks();
  });

  it('renvoie 200 et la balance si trouvée', async () => {
    const fakeBalance = { amount: 200, user: 'user123' };
    (Balance.find as unknown as jest.Mock).mockResolvedValue([fakeBalance]);

    await retrieeBalance(req, res, next);

    expect(Balance.find).toHaveBeenCalledWith({ user: 'user123' });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(fakeBalance);
  });



  it('renvoie 404 si aucune balance trouvée', async () => {
  (Balance.find as unknown as jest.Mock).mockResolvedValue([]); 

  await retrieeBalance(req, res, next);

  expect(Balance.find).toHaveBeenCalledWith({ user: 'user123' });
});

  it('renvoie 500 en cas d’erreur', async () => {
    (Balance.find as unknown as jest.Mock).mockRejectedValue(new Error('DB error'));
    (generateInternalServerErrorMessage as jest.Mock).mockReturnValue({
      error: 'Internal Server Error',
    });

    await retrieeBalance(req, res, next);

    expect(Balance.find).toHaveBeenCalledWith({ user: 'user123' });
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    expect(generateInternalServerErrorMessage).toHaveBeenCalled();
  });
});
