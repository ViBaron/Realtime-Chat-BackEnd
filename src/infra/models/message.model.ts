import mongoose, { Schema } from 'mongoose'

const messageSchema = new mongoose.Schema({
	_id: {
		require: true,
		auto: true,
		type: mongoose.Schema.Types.ObjectId,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	to_user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
	from_user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
	body: String,
	viewed_by_the_user: Boolean,
	room_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Rooms' },
})

export const MessageModel = mongoose.default.model('Message', messageSchema)
