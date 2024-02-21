import { NextFunction, Request, Response } from 'express'
import { Users } from '../useCases/user.useCase'
import { HttpException } from '../interfaces/HttpException'

class UserController {
	private usersUseCase: Users
	constructor() {
		this.usersUseCase = new Users()
	}
	async store(request: Request, response: Response, next: NextFunction) {
		const { name, email, password } = request.body
		try {
			const result = await this.usersUseCase.create({ name, email, password })
			return response.status(201).json(result)
		} catch (error) {
			next(error)
		}
	}
	async upload(request: Request, response: Response, next: NextFunction) {
		const file = request.file
		const { userId } = request
		try {
			if (!file?.filename) {
				throw new HttpException(400, 'Filename doenst exists')
			}
			const result = await this.usersUseCase.upload(file.filename, userId)
			return response.status(201).json(result)
		} catch (error) {
			next(error)
		}
	}
	async auth(request: Request, response: Response, next: NextFunction) {
		const { email, password } = request.body
		try {
			const result = await this.usersUseCase.auth({ email, password })

			return response.status(200).json(result)
		} catch (error) {
			next(error)
		}
	}
	async getAllUsers(request: Request, response: Response, next: NextFunction) {
		const { page, size } = request.query
		const DEFAULT_PAGE_SIZE = 10
		const DEFAULT_PAGE_NUMBER = 1
		const pageNumber = page ? Number(page) : DEFAULT_PAGE_NUMBER
		const pageSize = size ? Number(size) : DEFAULT_PAGE_SIZE
		try {
			const result = await this.usersUseCase.findAllUsers({
				pageNumber,
				pageSize,
			})
			return response.status(200).json(result)
		} catch (error) {
			next(error)
		}
	}
}

export { UserController }
