;
(function() {
	function Game(id) {
		this.timer = null
		this.canvas = document.getElementById(id)
		this.ctx = this.canvas.getContext('2d')
		this.fps = 1000 / 50
		this.images = {}
		this.backgroundList = []
		this.init()
	}

	var methods = Game.prototype;

	methods.init = function() {
		// 加载资源，资源加载成功，run 启动游戏
		this.loadImges(function() {
			this.initBackgroundList()
			this.run()
		}.bind(this))
	}

	/**
	 * @return {[type]} [description]
	 */
	methods.initBackgroundList = function() {
		this.backgroundList.push(new Background({
			img: this.images.house,
			width: 1726,
			height: 1136,
			x: 0,
			y: 0,
			speed: 2,
			game: this
		}))
	}

	/**
	 * 加载所有图片资源
	 * @return {[type]} [description]
	 */
	methods.loadImges = function(callback) {
		var self = this
		var img = new Image()
		img.src = 'http://file.dangapp.com/activitys/hf/spirit3/images/background.jpg'
		img.onload = function() {
			// 把这个 img 添加到 Game 的 images 中
			self.images['house'] = img
			callback()
		}
	}

	methods.run = function() {
		this.timer = window.setInterval(function() {
			this.mainLoop()
		}.bind(this), this.fps)
	}

	/**
	 * 游戏主循环，每 20 ms 执行一次
	 * @return {[type]} [description]
	 */
	methods.mainLoop = function() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
		this.backgroundList.forEach(function(item) {
			item.update()
			item.render()
		})
	}
	window.Game = Game
})()