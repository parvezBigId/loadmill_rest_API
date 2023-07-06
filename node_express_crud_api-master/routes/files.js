import express from 'express';

import { readFS, cloneFS, deleteDir, fileExists, updateFile } from '../controllers/files.js';

const router = express.Router();

router.get('/', readFS);

router.post('/', cloneFS);

router.get('/:name', fileExists);

router.post('/delete', deleteDir);

router.patch('/:name', updateFile);

export default router;