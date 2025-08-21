// src/routes/stamp.ts

import express from 'express'
import { getStamps, sendStamp } from '../controllers/stampController'

const router = express.Router()

router.get('/stamps', getStamps)
router.post('/send-stamp', sendStamp)

export default router
