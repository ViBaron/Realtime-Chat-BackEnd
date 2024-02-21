class User {
	private email: string
	constructor(email: string) {
		this.email = email
	}
	validateEmail() {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		return emailRegex.test(this.email)
	}
}

export { User }
