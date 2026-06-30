import { Router, Request, Response } from 'express';
import { getDb } from '../db/database';
import { Profile, CreateProfileBody, UpdateProfileBody } from '../types/profile';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  const profiles = getDb()
    .prepare('SELECT * FROM profiles ORDER BY created_at DESC')
    .all() as Profile[];
  res.json(profiles);
});

router.post('/', (req: Request<{}, {}, CreateProfileBody>, res: Response) => {
  const db = getDb();
  const body = req.body;

  const existing = db.prepare('SELECT id FROM profiles WHERE id = ?').get(body.id);
  if (existing) {
    return res.status(409).json({ error: 'Profile already exists' });
  }

  db.prepare(`
    INSERT INTO profiles
      (id, title, first, last, gender, email, phone, country, city, state,
       street_number, street_name, age, dob_date, picture_large, picture_thumbnail)
    VALUES
      (@id, @title, @first, @last, @gender, @email, @phone, @country, @city, @state,
       @street_number, @street_name, @age, @dob_date, @picture_large, @picture_thumbnail)
  `).run(body);

  const created = db.prepare('SELECT * FROM profiles WHERE id = ?').get(body.id) as Profile;
  res.status(201).json(created);
});

router.put('/:id', (req: Request<{ id: string }, {}, UpdateProfileBody>, res: Response) => {
  const db = getDb();
  const { id } = req.params;
  const { title, first, last } = req.body;

  const existing = db.prepare('SELECT id FROM profiles WHERE id = ?').get(id);
  if (!existing) {
    return res.status(404).json({ error: 'Profile not found' });
  }

  db.prepare(`
    UPDATE profiles SET
      title = COALESCE(@title, title),
      first = COALESCE(@first, first),
      last  = COALESCE(@last,  last)
    WHERE id = @id
  `).run({ id, title: title ?? null, first: first ?? null, last: last ?? null });

  const updated = db.prepare('SELECT * FROM profiles WHERE id = ?').get(id) as Profile;
  res.json(updated);
});

router.delete('/:id', (req: Request<{ id: string }>, res: Response) => {
  const result = getDb().prepare('DELETE FROM profiles WHERE id = ?').run(req.params.id);
  if (result.changes === 0) {
    return res.status(404).json({ error: 'Profile not found' });
  }
  res.status(204).send();
});

export default router;
