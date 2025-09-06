import express from 'express';
import { createNewsletter,updateNewsletter,deleteNewsletter,viewNewsletter,viewAllNewsletters, viewAllNewslettersPaginated, searchNewsletters} from '../controllers/newsletterController.js';

const newsletterRouter = express.Router();

newsletterRouter.post('/', createNewsletter);
newsletterRouter.put('/:id', updateNewsletter);
newsletterRouter.delete('/:id', deleteNewsletter);
newsletterRouter.get('/search', searchNewsletters);
newsletterRouter.get('/:id', viewNewsletter);
newsletterRouter.get('/all', viewAllNewsletters);
newsletterRouter.get('/', viewAllNewslettersPaginated);

export default newsletterRouter;