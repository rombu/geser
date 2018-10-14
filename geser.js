module.exports = function geser(){
	if (!(self instanceof geser)) {
		return new geser(arguments)
	}
	var self = this	
	var lets = self.lets = {}
	var args = this.geserargs(arguments) // args transfered of initialize geser object
	lets.args = args.args || undefined // arguments for processing
	lets.handler = args.handler || undefined // the last handler which do processing at result
	lets.get = args.get || undefined // get handler or returning value
	lets.set = args.set || undefined // set handler or returning value
	lets.self = args.self || undefined // initiator object
	lets.result = args.result || undefined // the result will returned if main result equal undeifned
}

geser.prototype.args = function(){
	var lets = this.lets
	lets.args = Array.prototype.slice.call(arguments)
	if (!lets.self) {
		lets.self = this
	}
	return this.processing(lets)
}

geser.prototype.get = function(getter){
	if (getter) {
		this.lets.get = getter
	}
	return this
}

geser.prototype.set = function(setter){
	if (setter) {
		this.lets.set = setter
	}
	return this
}

geser.prototype.self = function(object){
	if (object) {
		this.lets.self = object	
	}
	return this
}

geser.prototype.result = function(result){
	if (result) {
		this.lets.result = result
	}
	return this
}

geser.prototype.processing = function(lets){
	var result
	var gsr
	if (lets.args.length === 0) {
		gsr = lets.get
	} else {
		gsr = lets.set
	}
	try {
		if (typeof gsr === 'function') {
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

geser.prototype.geserargs = function(){
	var result = {}
	var args = Array.prototype.slice.call(arguments)
	if (args.length === 1 && typeof args[0] === 'object') {
		result = args[0]
	} else {
		result.get = arguments[0] || undefined
		result.set = arguments[1] || undefined
		result.handler = arguments[2] || undefined
		result.result = arguments[4] || undefined
		result.self = arguments[3] || undefined
	}
	return result
}