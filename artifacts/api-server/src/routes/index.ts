import { Router, type IRouter } from "express";
import healthRouter from "./health";
import smtpSettingsRouter from "./smtp-settings";
import contactRouter from "./contact";

const router: IRouter = Router();

router.use(healthRouter);
router.use(smtpSettingsRouter);
router.use(contactRouter);

export default router;
