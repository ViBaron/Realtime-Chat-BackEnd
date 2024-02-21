import { sign } from 'jsonwebtoken'
import { IAuth, ICreate, IPagination } from '../interfaces/users.interfaces'
import { UsersRepository } from '../repositories/user.repository'
import { compare, hash } from 'bcrypt'
import { HttpException } from '../interfaces/HttpException'

class Users {
	private userRepository: UsersRepository
	constructor() {
		this.userRepository = new UsersRepository()
	}
	async create({ name, email, password }: ICreate) {
		const findUser = await this.userRepository.findUserByEmail({ email })
		if (findUser) {
			throw new HttpException(400, 'User exists.')
		}
		const hashPassword = await hash(password as string, 10)
		const result = await this.userRepository.create({
			name,
			email,
			password: hashPassword,
		})
		return result
	}
	async upload(filename: string, userId: string) {
		const result = await this.userRepository.upload(filename, userId)
		return result
	}
	async auth({ email, password }: IAuth) {
		const findUser = await this.userRepository.findUserByEmail({ email })
		if (!findUser) {
			throw new HttpException(400, 'User not exists.')
		}
		const passwordMatch = await compare(password, findUser.password!)
		if (!passwordMatch) {
			throw new HttpException(400, 'User or password invalid')
		}
		if (!process.env.MONGO_DB_HOST) {
			throw new HttpException(498, 'TOKEN SECRET not found')
		}
		let secretKey = process.env.TOKEN_SECRET
		if (!secretKey) {
			throw new HttpException(498, 'There is no secret key')
		}
		const token = sign(
			{ userId: findUser._id, name: findUser.name, email },
			secretKey,
			{ expiresIn: '7d' }
		)
		return { token, user: { name: findUser.name, email: findUser.email } }
	}
	findAllUsers({ pageNumber, pageSize }: IPagination) {
		const result = this.userRepository.findAllUsers({ pageNumber, pageSize })
		return result
	}
}

export { Users }
