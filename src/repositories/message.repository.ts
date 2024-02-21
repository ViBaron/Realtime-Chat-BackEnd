import { MessageModel } from '../infra/models/message.model'
import { IGetLastMessages, IMessage } from '../interfaces/message.interfaces'

class MessageRepository {
	async create({ to_user_id, from_user_id, bodyMessage, room_id }: IMessage) {
		const result = await MessageModel.create({
			to_user_id,
			from_user_id,
			body: bodyMessage,
			viewed_by_the_user: false,
			room_id,
		})
		return result
	}
	async findMessagesRoom(room_id: string, userId: string, to_user_id: string) {
		const result = await MessageModel.find({
			room_id,
			from_user_id: userId,
			to_user_id,
			viewed_by_the_user: false,
		})
		return result
	}
	async updateMessage(room_id: string, userId: string, to_user_id: string) {
		const result = await MessageModel.updateMany(
			{
				room_id,
				from_user_id: userId,
				to_user_id,
				viewed_by_the_user: false,
			},
			{
				$set: { viewed_by_the_user: true },
			}
		)
		return result
	}
	async getHistoric({
		userId,
		userIdDestinatary,
		pageNumber,
	}: IGetLastMessages): Promise<IMessage[]> {
		const query = {
			$or: [
				{
					to_user_id: userId,
					from_user_id: userIdDestinatary,
				},
				{
					to_user_id: userIdDestinatary,
					from_user_id: userId,
				},
			],
		}
		const result = await MessageModel.find(query)
			.skip((pageNumber - 1) * 20)
			.limit(10)
			.sort({ createdAt: -1 })
		const resultReverse = result.reverse()
		return result ? resultReverse.map((message) => message.toObject()) : []
	}
}

export { MessageRepository }
