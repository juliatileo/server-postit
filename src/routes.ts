import { Router } from 'express'
import userController from './controller/UserController'
import postController from './controller/PostController'
import commentController from './controller/CommentController'
import auth from './middlewares/auth'

const routes = Router()

// Users
routes.get('/users/:id', userController.show)
routes.post('/users', userController.create)
routes.post('/auth', userController.auth)

// Posts
routes.get('/posts', auth, postController.index)
routes.get('/posts/popular', auth, postController.popular)
routes.get('/posts/:id', auth, postController.show)
routes.post('/posts', auth, postController.create)
routes.delete('/posts/:id', auth, postController.delete)
routes.put('/post/cookies/:id', auth, postController.addCookies)

// Comments
routes.get('/comments/:id', auth, commentController.index)
routes.post('/comments', auth, commentController.create)
routes.delete('/comments/:id', auth, commentController.delete)
routes.put('/comments/cookies/:id', auth, commentController.addCookies)

export default routes
