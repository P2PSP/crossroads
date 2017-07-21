const cntrl = require('../../controllers/channelController');
const db = require('../../models/channelModel');
const Q = require('../../models/Q');

afterEach(() => {
  db.setDB(undefined);
});

// Tests begin here

describe('List all channels', () => {
  test('no channels present', () => {
    const res = { json: jest.fn() };
    const req = { query: {} };

    const Database = {
      prepare: () => Database,
      all: () => undefined
    };
    db.setDB(Database);

    cntrl.listAllChannels(req, res);
    expect(res.json.mock.calls.length).toBe(1);
    expect(res.json.mock.calls[0][0].length).toBe(0);
  });

  test('some channels present', () => {
    const res = { json: jest.fn() };
    const req = { query: { limit: 5, offset: 10 } };

    const Database = { prepare: jest.fn(), all: jest.fn() };
    Database.prepare.mockReturnValueOnce(Database);
    Database.all.mockReturnValueOnce([
      { splitterAddr: '127.0.0.1:23456' },
      { splitterAddr: '127.0.0.1:23456' }
    ]);
    db.setDB(Database);

    cntrl.listAllChannels(req, res);

    expect(Database.prepare.mock.calls.length).toBe(1);
    expect(Database.prepare.mock.calls[0][0]).toBe(Q.selectAllChannels);

    expect(Database.all.mock.calls.length).toBe(1);
    expect(Database.all.mock.calls[0][0]).toEqual(req.query);

    expect(res.json.mock.calls.length).toBe(1);
    expect(res.json.mock.calls[0][0].length).toBe(2);
  });

  test('Error thrown', () => {
    const res = { sendStatus: jest.fn() };
    const req = { query: {} };

    const Database = {
      prepare: () => {
        throw Error;
      }
    };
    db.setDB(Database);

    cntrl.listAllChannels(req, res);
    expect(res.sendStatus.mock.calls.length).toBe(1);
    expect(res.sendStatus.mock.calls[0][0]).toBe(500);
  });
});

describe('List single channel', () => {
  test('Found', () => {
    const req = { params: { channelUrl: 'url' } };
    const res = { json: jest.fn() };

    const Database = {
      prepare: jest.fn(),
      get: () => {
        return { splitterAddr: '127.0.0.1:12000' };
      }
    };
    Database.prepare.mockReturnValueOnce(Database);
    db.setDB(Database);

    cntrl.getChannel(req, res);
    expect(res.json.mock.calls.length).toBe(1);
    expect(Database.prepare.mock.calls[0][0]).toBe(Q.selectChannel);
  });

  test('Not Found', () => {
    const req = { params: { channelUrl: 'url' } };
    const res = { sendStatus: jest.fn() };

    const Database = {
      prepare: () => Database,
      get: () => {
        return undefined;
      }
    };
    db.setDB(Database);

    cntrl.getChannel(req, res);
    expect(res.sendStatus.mock.calls.length).toBe(1);
    expect(res.sendStatus.mock.calls[0][0]).toBe(400);
  });

  test('Error thrown', () => {
    const req = { params: { channelUrl: 'url' } };
    const res = { sendStatus: jest.fn() };

    const Database = {
      prepare: () => {
        throw Error;
      }
    };
    db.setDB(Database);

    cntrl.getChannel(req, res);
    expect(res.sendStatus.mock.calls.length).toBe(1);
    expect(res.sendStatus.mock.calls[0][0]).toBe(500);
  });
});

describe('Add a new channel', () => {
  test('successfully', async () => {
    const req = { body: { channelName: 'newChannel' } };
    const res = { json: jest.fn() };

    const Database = {
      prepare: jest.fn(),
      run: jest.fn()
    };
    Database.prepare.mockReturnValueOnce(Database);
    db.setDB(Database);

    await cntrl.addChannel(req, res);

    expect(Database.prepare.mock.calls[0][0]).toBe(Q.insertChannel);
    expect(res.json.mock.calls.length).toBe(1);
    expect(res.json.mock.calls[0][0].channelUrl).not.toBe(undefined);
    expect(res.json.mock.calls[0][0].channelPassword).not.toBe(undefined);
  });

  test('fail', async () => {
    const req = { body: { channelName: 'newChannel' } };
    const res = { sendStatus: jest.fn() };

    const Database = {
      prepare: () => {
        throw Error;
      }
    };
    db.setDB(Database);

    await cntrl.addChannel(req, res);

    expect(res.sendStatus.mock.calls.length).toBe(1);
    expect(res.sendStatus.mock.calls[0][0]).toBe(500);
  });
});

describe('Editing an existing channel', () => {
  test('successfully', async () => {
    const req = { body: { channelNewName: 'newChannel' } };
    const res = { end: jest.fn() };

    const Database = {
      prepare: jest.fn(),
      run: jest.fn()
    };
    Database.prepare.mockReturnValueOnce(Database);
    db.setDB(Database);

    await cntrl.editChannel(req, res);

    expect(Database.prepare.mock.calls[0][0]).toBe(Q.updateChannel);
    expect(res.end.mock.calls.length).toBe(1);
  });

  test('fail', async () => {
    const req = { body: { channelNewName: 'newChannel' } };
    const res = { sendStatus: jest.fn() };

    const Database = {
      prepare: () => {
        throw Error;
      }
    };
    db.setDB(Database);

    await cntrl.editChannel(req, res);

    expect(res.sendStatus.mock.calls.length).toBe(1);
    expect(res.sendStatus.mock.calls[0][0]).toBe(500);
  });
});

describe('Deleting an existing channel', () => {
  test('successfully', async () => {
    const req = { body: { channelUrl: 'someUrl' } };
    const res = { end: jest.fn() };

    const Database = {
      prepare: jest.fn(),
      run: jest.fn()
    };
    Database.prepare.mockReturnValueOnce(Database);
    db.setDB(Database);

    await cntrl.removeChannel(req, res);

    expect(Database.prepare.mock.calls[0][0]).toBe(Q.deleteChannel);
    expect(res.end.mock.calls.length).toBe(1);
  });

  test('fail', async () => {
    const req = { body: { channelNewName: 'newChannel' } };
    const res = { sendStatus: jest.fn() };

    const Database = {
      prepare: () => {
        throw Error;
      }
    };
    db.setDB(Database);

    await cntrl.removeChannel(req, res);

    expect(res.sendStatus.mock.calls.length).toBe(1);
    expect(res.sendStatus.mock.calls[0][0]).toBe(500);
  });
});
