import { HttpException } from '../interfaces/HttpException'
import { RoomsRepository } from '../repositories/rooms.repository'
import { UsersRepository } from '../repositories/user.repository'

class Rooms {
	private roomsRepository: RoomsRepository
	private usersRepository: UsersRepository
	constructor() {
		this.roomsRepository = new RoomsRepository()
		this.usersRepository = new UsersRepository()
	}
	async create(email: string, userId: string) {
		const findDestinationUserId = await this.usersRepository.findUserByEmail({
			email,
		})
		if (!findDestinationUserId) {
			throw new HttpException(400, 'User Destination Not Found')
		}
		const result = await this.roomsRepository.create({
			user_id_joined_room: findDestinationUserId.id,
			user_id_created_room: userId,
		})
		return result
	}
	async find(email: string, userId: string) {
		const findDestinationUserId = await this.usersRepository.findUserByEmail({
			email,
		})
		if (!findDestinationUserId) {
			throw new HttpException(400, 'User Destination Not Found')
		}
		const findRoom = await this.roomsRepository.find({
			user_id_created_room: userId,
			user_id_joined_room: findDestinationUserId.id,
		})
		return findRoom
	}
}

export { Rooms }
