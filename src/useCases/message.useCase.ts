import { HttpException } from '../interfaces/HttpException'
import { IGetHistoric } from '../interfaces/message.interfaces'
import { MessageRepository } from '../repositories/message.repository'
import { UsersRepository } from '../repositories/user.repository'

class Message {
	private messageRepository: MessageRepository
	private userRepository: UsersRepository
	constructor() {
		this.messageRepository = new MessageRepository()
		this.userRepository = new UsersRepository()
	}
	async create(
		userId: string,
		email_to_user: string,
		message_from_user: string,
		roomId: string
	) {
		const findUserByEmail = await this.userRepository.findUserByEmail({
			email: email_to_user,
		})
		if (!findUserByEmail) {
			throw new HttpException(400, 'User not found')
		}
		await this.messageRepository.create({
			to_user_id: findUserByEmail.id,
			from_user_id: userId,
			bodyMessage: message_from_user,
			room_id: roomId,
		})
		return { message: 'Save Message' }
	}
	async updateView(room_id: string, userId: string, email_to_user: string) {
		const findUserByEmail = await this.userRepository.findUserByEmail({
			email: email_to_user,
		})
		if (!findUserByEmail) {
			throw new HttpException(400, 'User not found')
		}
		const updateMessagesUser = this.messageRepository.updateMessage(
			room_id,
			userId,
			findUserByEmail.id
		)
		return updateMessagesUser
	}
	async getHistoric({ emailDestinatary, userId, pageNumber }: IGetHistoric) {
		const findUserByEmail = await this.userRepository.findUserByEmail({
			email: emailDestinatary,
		})
		if (!findUserByEmail) {
			throw new HttpException(400, 'User not found')
		}
		const messages = await this.messageRepository.getHistoric({
			userId,
			userIdDestinatary: findUserByEmail.id,
			pageNumber,
		})
		return messages
	}
}

export { Message }
