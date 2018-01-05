;(function () {
  function Background (options) {
    this.img = options.img
    this.width = options.width
    this.height = options.height
    this.x = options.x
    this.y = options.y
    this.speed = options.speed
    this.game = options.game
    this.amount = parseInt(this.game.canvas.width / this.width) + 1
  }

  var methods = Background.prototype

  methods.update  = function () {
    this.x -= this.speed
    // 在每一次 update 的时候，判断
    if (this.x <= -this.amount * this.width) {
      this.x = 0
    }
  }

  methods.render = function () {
    for (var i = 0; i < this.amount * 2; i++) {
      this.game.ctx.drawImage(this.img, this.x + this.width * i, this.y)
    }
  }

  window.Background = Background
})()
