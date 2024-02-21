export interface IMessage {
	to_user_id: string
	from_user_id: string
	bodyMessage: string
	room_id: string
}
export interface IGetHistoric {
	emailDestinatary: string
	userId: string
	pageNumber: number
}

export interface IGetLastMessages {
	userIdDestinatary: string
	userId: string
	pageNumber: number
}
