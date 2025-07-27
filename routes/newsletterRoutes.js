import express from 'express';
import { createNewsletter,updateNewsletter,deleteNewsletter,viewNewsletter,viewAllNewsletters} from '../controllers/newsletterController.js';

const newsletterRouter = express.Router();

newsletterRouter.post('/', createNewsletter);
newsletterRouter.put('/:id', updateNewsletter);
newsletterRouter.delete('/:id', deleteNewsletter);
newsletterRouter.get('/:id', viewNewsletter);
newsletterRouter.get('/', viewAllNewsletters);

export default newsletterRouter;