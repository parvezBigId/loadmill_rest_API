import express from 'express';

import { readFS, cloneFS, deleteDir, updateFile, readFile, syncTime } from '../controllers/files.js';

const router = express.Router();

router.get('/', readFS);

router.post('/', cloneFS);

router.post('/readFile', readFile);

//router.get('/:name', fileExists);

router.post('/delete', deleteDir);

router.patch('/:name', updateFile);

router.get('/syncTime', syncTime);

export default router;
