import http from 'http'
import express, { Application, NextFunction, Request, Response } from 'express'
import { Server } from 'socket.io'
import { UserRoutes } from './routes/user.routes'
import { RoomsRoutes } from './routes/rooms.routes'
import { MessageRoutes } from './routes/message.routes'
import { connect } from './infra/database'
import fs from 'fs'
import dotenv from 'dotenv'
import { errorMiddleware } from './middlewares/error.middleware'

class App {
	private app: Application
	private http: http.Server
	private io: Server
	private userRoutes = new UserRoutes()
	private roomsRoutes = new RoomsRoutes()
	private messageRoutes = new MessageRoutes()
	constructor() {
		this.app = express()
		this.http = new http.Server(this.app)
		this.io = new Server(this.http)
		this.middlewaresInitialize()
		this.initializeRoutes()
		this.interceptionError()
		this.initializeHtml()
	}
	listen() {
		this.http.listen(3333, async () => {
			try {
				dotenv.config()
				await connect()
				console.log('Connected to database')
			} catch (error) {
				console.log(error)
			}
		})
	}
	listenSocket() {
		const userStatus: string[] = []
		this.io.on('connection', (userSocket) => {
			console.log('User connected', userSocket.handshake.auth.token)
			userSocket.on('join_room', (room_id) => {
				userSocket.join(room_id)
			})
			userSocket.on('user_connected', (userId) => {
				userStatus.push(userId)
				this.io.emit('updateUserStatus', userStatus)
			})
			userSocket.on('message', (data) => {
				userSocket.to(data.room_id).emit('room_message', data.message)
			})
			userSocket.on('disconnect', () => {
				const userId = userSocket.handshake.auth.token
				userStatus.splice(userStatus.indexOf(userId), 1)
				this.io.emit('updateUserStatus', userStatus)
				console.log('User disconnected', userId)
			})
		})
	}
	private initializeHtml() {
		this.app.get('/index', (req, res) => {
			res.sendFile(__dirname + '/index.html')
		})
	}
	private initializeRoutes() {
		this.app.use('/users', this.userRoutes.router)
		this.app.use('/rooms', this.roomsRoutes.router)
		this.app.use('/messages', this.messageRoutes.router)
	}
	private middlewaresInitialize() {
		this.app.use(express.json())
		this.app.use(express.urlencoded({ extended: true }))
		fs.accessSync('.env', fs.constants.F_OK)
	}
	private interceptionError() {
		this.app.use(errorMiddleware)
	}
}

export { App }
