import { NextFunction, Request, Response } from 'express'
import { Message } from '../useCases/message.useCase'

class MessageController {
	private messageUseCase: Message
	constructor() {
		this.messageUseCase = new Message()
	}
	async store(request: Request, response: Response, next: NextFunction) {
		const { message } = request.body
		const { userId } = request
		try {
			const email_from_user = message.email
			const message_from_user = message.body_message
			const roomId = message.room_id
			const result = await this.messageUseCase.create(
				userId,
				email_from_user,
				message_from_user,
				roomId
			)
			return response.status(200).json({ ok: true })
		} catch (error) {
			next(error)
		}
	}
	async updateView(request: Request, response: Response, next: NextFunction) {
		const { room_id, email_to_user } = request.body
		const { userId } = request
		try {
			const result = await this.messageUseCase.updateView(
				room_id,
				userId,
				email_to_user
			)
			return response.status(200).json(result)
		} catch (error) {
			next(error)
		}
	}
	async getHistoric(request: Request, response: Response, next: NextFunction) {
		const { emailDestinatary } = request.params
		const { page } = request.query
		const DEFAULT_PAGE_NUMBER = 1
		const pageNumber = page ? Number(page) : DEFAULT_PAGE_NUMBER
		const { userId } = request
		try {
			const result = await this.messageUseCase.getHistoric({
				emailDestinatary,
				userId,
				pageNumber,
			})
			return response.status(200).json(result)
		} catch (error) {
			next(error)
		}
	}
}

export { MessageController }
