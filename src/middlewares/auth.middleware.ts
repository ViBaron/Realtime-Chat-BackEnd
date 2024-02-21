import { NextFunction, Request, Response } from 'express'
import { HttpException } from '../interfaces/HttpException'
import { verify } from 'jsonwebtoken'
import { IPayload } from '../interfaces/users.interfaces'

export function authMiddleware(
	request: Request,
	response: Response,
	next: NextFunction
) {
	const { authorization } = request.headers
	if (!authorization) {
		throw new HttpException(401, 'Token Missing')
	}
	try {
		const [, token] = authorization.split(' ')
		if (!process.env.TOKEN_SECRET) {
			throw new HttpException(498, 'There is no secret key')
		}
		const { name, userId, email } = verify(
			token,
			process.env.TOKEN_SECRET
		) as IPayload
		request.userId = userId
		request.name = name
		request.email = email
		next()
	} catch (error) {
		throw new HttpException(401, 'Token Expired')
	}
}
