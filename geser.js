module.exports = function geser(){
	if (!(self instanceof geser)) {
		return new geser(arguments)
	}
	const self = this	
	const lets = self.lets = {}
	let args = geserargs(arguments) // args transfered of initialize geser object
	lets.args = args.args || undefined // arguments for processing
	lets.handler = args.handler || undefined // the last handler which do processing at result
	lets.get = args.get || undefined // get handler or returning value
	lets.set = args.set || undefined // set handler or returning value
	lets.self = args.self || undefined // initiator object
	lets.result = args.result || undefined // the result will returned if main result equal undeifned
	
	self.args = function(){
		lets.args = Array.prototype.slice.call(arguments)
		if (!lets.self) {
			lets.self = this
		}
		return processing(lets)
	}
}
geser.prototype.get = function(){
	this.lets.get = arguments[0]
	return this
}
geser.prototype.set = function(){
	this.lets.set = arguments[0]
	return this
}
geser.prototype.self = function(){
	this.lets.self = arguments[0]
	return this
}
geser.prototype.result = function(){
	this.lets.result = arguments[0]
	return this
}
function processing(lets){
	let result
	let gsr
	if (lets.args.length === 0) {
		gsr = lets.get
	} else {
		gsr = lets.set
	}
	try {
		if (gsr && typeof gsr === 'function') {
			result = gsr.apply(lets.self, lets.args)
		} else {
			result = gsr
		}
		if (typeof lets.handler === 'function') {
			result = lets.handler.call(lets.self, result)
		}
	} catch (error) {
		throw error
	}
	if (!result && lets.result) {
		result = lets.result
	}
	return result
}
function geserargs(){
	let result = {}
	let args = Array.prototype.slice.call(arguments)
	if (args.length === 1 && typeof args[0] === 'object') {
		let arg = args[0]
		result.get = arg.get || undefined
		result.set = arg.set || undefined
		result.self = arg.self || undefined
		result.result = arg.result || undefined
		result.handler = arg.handler || undefined
	} else {
		result.get = arguments[0] || undefined
		result.set = arguments[1] || undefined
		result.self = arguments[2] || undefined
		result.result = arguments[3] || undefined
		result.handler = arguments[4] || undefined
	}
	return result
}